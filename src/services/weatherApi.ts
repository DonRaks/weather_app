import { Location, WeatherData, HourlyItem, DailyItem, CurrentWeather } from '../types/weather';
import { WMO_CODES } from '../utils/constants';
import {
  calculatePressureTrend,
  normalizeAqiData,
  calculateSunMoon,
  buildPrecipitationTimeline,
  buildStory,
  calculateComfort,
  generateIntelligenceSummary
} from '../utils/meteorology';

/**
 * WeatherAPI Service Class
 *
 * Encapsulates all external network requests to:
 * 1. Open-Meteo Geocoding API (Autocomplete location queries).
 * 2. BigDataCloud Reverse Geocoding API (Client-side Lat/Lon coordinates to City/Country translation).
 * 3. Open-Meteo High-Resolution Numerical Forecast API (10-Day Daily & 24-Hour Hourly Telemetry).
 * 4. Open-Meteo Air Quality & Particulates API (CAMS model PM2.5, PM10, NO2, O3, CO, US/EU AQI).
 *
 * Handles normalization, unit harmonization, default safety fallbacks, and payload transformations.
 */
export class WeatherAPI {
  /**
   * Search global locations by query string using Open-Meteo Geocoding API.
   * Free & open access with zero rate limits or API keys required.
   *
   * @param {string} query - Location name or prefix (e.g. "Tokyo", "Berlin", "San Francisco").
   * @returns {Promise<Location[]>} Array of up to 8 matched geographic locations.
   */
  static async searchLocations(query: string): Promise<Location[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Geocoding search failed with status ${res.status}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        return [];
      }

      return data.results.map((r: any) => ({
        name: r.name,
        country: r.country || '',
        countryCode: r.country_code || '',
        admin1: r.admin1 || '',
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone || 'auto',
        population: r.population || 0
      }));
    } catch (err) {
      console.warn('Geocoding search error:', err);
      return [];
    }
  }

  /**
   * Reverse Geocodes coordinates (Latitude / Longitude) to resolve the nearest city and country.
   * Uses BigDataCloud client-side reverse geocoding API.
   *
   * @param {number} lat - Latitude in decimal degrees.
   * @param {number} lon - Longitude in decimal degrees.
   * @returns {Promise<Location>} The resolved location object.
   */
  static async reverseGeocode(lat: number, lon: number): Promise<Location> {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
        return {
          name: cityName,
          country: data.countryName || '',
          countryCode: data.countryCode || '',
          admin1: data.principalSubdivision || '',
          latitude: lat,
          longitude: lon,
          timezone: 'auto'
        };
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    }

    return {
      name: 'Current Location',
      country: '',
      countryCode: '',
      admin1: '',
      latitude: lat,
      longitude: lon,
      timezone: 'auto'
    };
  }

  /**
   * Fetches the complete meteorological dataset for a specific geographic location.
   * Executes parallel fetches for weather forecasts and atmospheric air quality telemetry.
   *
   * @param {Location} location - Target geographic location with latitude and longitude.
   * @returns {Promise<WeatherData>} Normalized full-suite meteorological domain model.
   */
  static async fetchFullWeather(location: Location): Promise<WeatherData> {
    const { latitude, longitude } = location;

    // Open-Meteo High-Resolution Forecast endpoint with 10-day range and hourly metrics
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=10`;

    // Open-Meteo Air Quality endpoint
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index&timezone=auto`;

    // Execute in parallel for sub-second page performance
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl).catch(() => null)
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather service returned HTTP ${weatherRes.status}`);
    }

    const rawWeather = await weatherRes.json();
    const rawAqi = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

    return this.normalizeWeatherData(rawWeather, rawAqi, location);
  }

  /**
   * Normalizes raw API response dictionaries into strict, type-safe WeatherData objects.
   *
   * @param {any} raw - Raw weather forecast JSON response.
   * @param {any} rawAqi - Raw air quality JSON response.
   * @param {Location} location - Target location metadata.
   * @returns {WeatherData} Unified weather data structure.
   */
  static normalizeWeatherData(raw: any, rawAqi: any, location: Location): WeatherData {
    const cur = raw.current || {};
    const hourly = raw.hourly || {};
    const daily = raw.daily || {};

    const wmoInfo = WMO_CODES[cur.weather_code] || {
      label: 'Clear',
      category: 'clear',
      icon: 'sun',
      dayIcon: 'sun',
      nightIcon: 'moon'
    };
    const isDay = cur.is_day === 1;
    const iconType = isDay ? wmoInfo.dayIcon : wmoInfo.nightIcon;

    // 1. Current Telemetry Block
    const current: CurrentWeather = {
      temp: Math.round(cur.temperature_2m ?? 25),
      feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 25),
      tempMin: Math.round(daily.temperature_2m_min?.[0] ?? cur.temperature_2m ?? 20),
      tempMax: Math.round(daily.temperature_2m_max?.[0] ?? cur.temperature_2m ?? 30),
      humidity: cur.relative_humidity_2m ?? 50,
      dewPoint: hourly.dew_point_2m
        ? Math.round(hourly.dew_point_2m[0])
        : Math.round((cur.temperature_2m || 25) - ((100 - (cur.relative_humidity_2m || 50)) / 5)),
      pressure: Math.round(cur.pressure_msl || cur.surface_pressure || 1013),
      pressureTrend: calculatePressureTrend(hourly.pressure_msl),
      visibility: hourly.visibility ? Math.round(hourly.visibility[0] / 1000) : 10,
      windSpeed: Math.round(cur.wind_speed_10m ?? 10),
      windDirection: cur.wind_direction_10m ?? 0,
      windGusts: Math.round(cur.wind_gusts_10m || (cur.wind_speed_10m || 10) * 1.25),
      uvIndex: (hourly.uv_index && hourly.uv_index[0]) !== undefined
        ? Math.round(hourly.uv_index[0] * 10) / 10
        : (daily.uv_index_max?.[0] || 0),
      cloudCover: cur.cloud_cover ?? 20,
      precipitation: cur.precipitation ?? 0,
      isDay,
      conditionCode: cur.weather_code ?? 0,
      conditionText: wmoInfo.label,
      conditionCategory: wmoInfo.category,
      iconType,
      lastUpdated: new Date()
    };

    // 2. 24-Hour Horizon Hourly Array starting from current local hour
    const nowISO = new Date().toISOString();
    let startIdx = 0;
    if (hourly.time) {
      const nowPrefix = nowISO.slice(0, 13);
      const found = hourly.time.findIndex((t: string) => t.startsWith(nowPrefix));
      if (found !== -1) startIdx = found;
    }

    const hourlyList: HourlyItem[] = [];
    const maxHour = Math.min(startIdx + 24, hourly.time?.length || 0);

    for (let i = startIdx; i < maxHour; i++) {
      const hourTime = new Date(hourly.time[i]);
      const hourWmo = WMO_CODES[hourly.weather_code[i]] || {
        label: 'Clear',
        category: 'clear',
        icon: 'sun',
        dayIcon: 'sun',
        nightIcon: 'moon'
      };
      const hourIsDay = hourly.is_day
        ? hourly.is_day[i] === 1
        : (hourTime.getHours() >= 6 && hourTime.getHours() < 19);

      hourlyList.push({
        time: hourTime,
        formattedTime: i === startIdx ? 'Now' : hourTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        temp: Math.round(hourly.temperature_2m[i]),
        feelsLike: Math.round(hourly.apparent_temperature[i]),
        humidity: hourly.relative_humidity_2m[i],
        dewPoint: Math.round(hourly.dew_point_2m ? hourly.dew_point_2m[i] : hourly.temperature_2m[i] - 5),
        precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        precipitationAmount: hourly.precipitation ? hourly.precipitation[i] : 0,
        conditionCode: hourly.weather_code[i],
        conditionText: hourWmo.label,
        iconType: hourIsDay ? hourWmo.dayIcon : hourWmo.nightIcon,
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        windDirection: hourly.wind_direction_10m[i],
        windGusts: Math.round(hourly.wind_gusts_10m ? hourly.wind_gusts_10m[i] : hourly.wind_speed_10m[i] * 1.2),
        uvIndex: hourly.uv_index ? hourly.uv_index[i] : 0,
        cloudCover: hourly.cloud_cover[i],
        isDay: hourIsDay
      });
    }

    // 3. 10-Day Extended Daily Forecast with range bar geometry
    const allWeekMin = daily.temperature_2m_min?.length ? Math.min(...daily.temperature_2m_min) : current.tempMin;
    const allWeekMax = daily.temperature_2m_max?.length ? Math.max(...daily.temperature_2m_max) : current.tempMax;

    const dailyList: DailyItem[] = [];
    const dailyCount = daily.time?.length || 0;

    for (let i = 0; i < dailyCount; i++) {
      const dayDate = new Date(daily.time[i] + 'T12:00:00');
      const dayWmo = WMO_CODES[daily.weather_code[i]] || {
        label: 'Clear',
        category: 'clear',
        icon: 'sun',
        dayIcon: 'sun',
        nightIcon: 'moon'
      };
      const isToday = i === 0;

      const dayName = isToday ? 'Today' : dayDate.toLocaleDateString([], { weekday: 'short' });
      const fullDate = dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const tMin = Math.round(daily.temperature_2m_min[i]);
      const tMax = Math.round(daily.temperature_2m_max[i]);

      const rangeSpan = (allWeekMax - allWeekMin) || 1;
      const leftPercent = Math.max(0, Math.min(100, ((tMin - allWeekMin) / rangeSpan) * 100));
      const rightPercent = Math.max(0, Math.min(100, ((allWeekMax - tMax) / rangeSpan) * 100));
      const widthPercent = Math.max(8, 100 - leftPercent - rightPercent);

      let currentTempPercent: number | null = null;
      if (isToday) {
        currentTempPercent = Math.max(0, Math.min(100, ((current.temp - allWeekMin) / rangeSpan) * 100));
      }

      dailyList.push({
        date: dayDate,
        dayName,
        fullDate,
        isToday,
        tempMin: tMin,
        tempMax: tMax,
        apparentMin: Math.round(daily.apparent_temperature_min[i]),
        apparentMax: Math.round(daily.apparent_temperature_max[i]),
        conditionCode: daily.weather_code[i],
        conditionText: dayWmo.label,
        iconType: dayWmo.dayIcon || dayWmo.icon,
        precipProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
        precipSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        windSpeedMax: Math.round(daily.wind_speed_10m_max[i]),
        windGustsMax: Math.round(daily.wind_gusts_10m_max[i]),
        windDirection: daily.wind_direction_10m_dominant[i],
        uvIndexMax: daily.uv_index_max ? Math.round(daily.uv_index_max[i] * 10) / 10 : 0,
        sunrise: daily.sunrise[i],
        sunset: daily.sunset[i],
        daylightHours: daily.daylight_duration ? Math.round((daily.daylight_duration[i] / 3600) * 10) / 10 : 12,
        rangeBar: {
          left: leftPercent,
          width: widthPercent,
          currentPos: currentTempPercent
        }
      });
    }

    // 4. Auxiliary Meteorological Domain Derivations
    const aqi = normalizeAqiData(rawAqi);
    const sunMoon = calculateSunMoon(daily.sunrise?.[0] || null, daily.sunset?.[0] || null, new Date());
    const precipTimeline = buildPrecipitationTimeline(hourlyList);
    const story = buildStory(hourlyList, dailyList[0]);
    const comfort = calculateComfort(current.temp, current.humidity, current.windSpeed, current.uvIndex);
    const intelligenceSummary = generateIntelligenceSummary(current, hourlyList, dailyList);

    return {
      location: {
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: raw.timezone || 'auto'
      },
      current,
      hourly: hourlyList,
      daily: dailyList,
      aqi,
      sunMoon,
      precipTimeline,
      story,
      comfort,
      intelligenceSummary
    };
  }
}
