import {
  CurrentWeather,
  HourlyItem,
  DailyItem,
  AQIData,
  SunMoonData,
  PrecipSlot,
  StoryData,
  ComfortData
} from '../types/weather';

/**
 * Meteorology Calculations & Domain Utilities
 *
 * Implements scientific algorithms for:
 * - Barometric pressure trend identification
 * - Air Quality Index (AQI) standard categorization
 * - Astronomical Julian Day Moon phase and illumination calculations
 * - Solar daylight trajectory & solar noon tracking
 * - Precipitation timeline horizon assembly
 * - 4-part diurnal story synthesis
 * - Multi-factor human biometeorology comfort scoring
 * - Contextual natural-language weather intelligence briefing
 * - Unit transformations & cardinal direction vector mapping
 */

/**
 * Calculates barometric pressure trend ('Rising', 'Falling', 'Steady')
 * based on the 3-hour pressure differential.
 *
 * @param {number[]} [pressureArray] - Array of recent hourly mean sea-level pressures in hPa.
 * @returns {'Steady' | 'Rising' | 'Falling'} The calculated barometric tendency.
 */
export function calculatePressureTrend(pressureArray?: number[]): 'Steady' | 'Rising' | 'Falling' {
  if (!pressureArray || pressureArray.length < 3) return 'Steady';
  const diff = pressureArray[0] - pressureArray[2];
  if (diff > 1.5) return 'Rising';
  if (diff < -1.5) return 'Falling';
  return 'Steady';
}

/**
 * Normalizes raw Air Quality API responses into structured domain data
 * with EPA/WHO health thresholds, status descriptors, and activity advice.
 *
 * @param {any} rawAqi - Raw air quality response payload.
 * @returns {AQIData} Normalized air quality data structure.
 */
export function normalizeAqiData(rawAqi: any): AQIData {
  if (!rawAqi || !rawAqi.current) {
    return {
      aqi: 32,
      usAqi: 32,
      europeanAqi: 20,
      status: 'Good',
      statusClass: 'good',
      advice: 'Air quality is satisfactory and poses little or no risk.',
      pm2_5: 7.2,
      pm10: 12.4,
      no2: 15.0,
      o3: 45.0,
      co: 180
    };
  }

  const cur = rawAqi.current;
  const usAqi = cur.us_aqi || Math.round((cur.pm2_5 || 10) * 3.5);
  let status = 'Good';
  let statusClass: AQIData['statusClass'] = 'good';
  let advice = 'Air quality is ideal for outdoor activities.';

  if (usAqi > 200) {
    status = 'Very Unhealthy';
    statusClass = 'very-unhealthy';
    advice = 'Health alert: avoid outdoor exertion.';
  } else if (usAqi > 150) {
    status = 'Unhealthy';
    statusClass = 'unhealthy';
    advice = 'Sensitive groups and general public should limit prolonged outdoor time.';
  } else if (usAqi > 100) {
    status = 'Unhealthy for Sensitive';
    statusClass = 'unhealthy-sensitive';
    advice = 'People with respiratory disease should reduce prolonged exertion.';
  } else if (usAqi > 50) {
    status = 'Moderate';
    statusClass = 'moderate';
    advice = 'Air quality is acceptable; unusually sensitive individuals should take note.';
  }

  return {
    aqi: usAqi,
    usAqi,
    europeanAqi: cur.european_aqi || Math.round(usAqi * 0.7),
    status,
    statusClass,
    advice,
    pm2_5: cur.pm2_5 !== undefined ? Math.round(cur.pm2_5 * 10) / 10 : 8,
    pm10: cur.pm10 !== undefined ? Math.round(cur.pm10 * 10) / 10 : 15,
    no2: cur.nitrogen_dioxide !== undefined ? Math.round(cur.nitrogen_dioxide * 10) / 10 : 12,
    o3: cur.ozone !== undefined ? Math.round(cur.ozone * 10) / 10 : 50,
    co: cur.carbon_monoxide ? Math.round(cur.carbon_monoxide) : 150
  };
}

/**
 * Calculates astronomical lunar phase and illumination percentage
 * using the deterministic Julian Day algorithm.
 *
 * @param {Date} date - The current date object.
 * @returns {{ phase: number, name: string, illumination: number }} The moon phase properties.
 */
export function calculateMoonPhase(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const c = 365.25 * year;
  const e = 30.6 * month;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const bInt = parseInt(jd.toString(), 10);
  jd -= bInt;
  let b = Math.round(jd * 8);
  if (b >= 8) b = 0;

  const phaseNames = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent'
  ];

  const illumination = Math.round(((1 - Math.cos(jd * 2 * Math.PI)) / 2) * 100);

  return {
    phase: jd,
    name: phaseNames[b] || 'Waxing Moon',
    illumination
  };
}

/**
 * Computes solar arc progression, sunrise, sunset, solar noon, and lunar state.
 *
 * @param {string | null} sunriseISO - ISO date string of today's sunrise.
 * @param {string | null} sunsetISO - ISO date string of today's sunset.
 * @param {Date} now - Current date timestamp.
 * @returns {SunMoonData} Calculated astronomical metrics.
 */
export function calculateSunMoon(sunriseISO: string | null, sunsetISO: string | null, now: Date): SunMoonData {
  const sunriseDate = sunriseISO ? new Date(sunriseISO) : new Date(new Date().setHours(6, 30, 0, 0));
  const sunsetDate = sunsetISO ? new Date(sunsetISO) : new Date(new Date().setHours(18, 45, 0, 0));

  const sunriseTimeStr = sunriseDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const sunsetTimeStr = sunsetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const totalDaylightMs = Math.max(1, sunsetDate.getTime() - sunriseDate.getTime());
  const elapsedDaylightMs = now.getTime() - sunriseDate.getTime();

  let sunPositionPercent = 0;
  let isDay = false;

  if (now >= sunriseDate && now <= sunsetDate) {
    isDay = true;
    sunPositionPercent = Math.max(0, Math.min(100, (elapsedDaylightMs / totalDaylightMs) * 100));
  } else if (now < sunriseDate) {
    sunPositionPercent = 0;
  } else {
    sunPositionPercent = 100;
  }

  const solarNoonMs = sunriseDate.getTime() + totalDaylightMs / 2;
  const solarNoonStr = new Date(solarNoonMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const moon = calculateMoonPhase(now);

  return {
    sunrise: sunriseTimeStr,
    sunset: sunsetTimeStr,
    solarNoon: solarNoonStr,
    sunPositionPercent,
    isDay,
    daylightHours: Math.round((totalDaylightMs / (1000 * 60 * 60)) * 10) / 10,
    moonPhaseName: moon.name,
    moonIllumination: moon.illumination,
    moonPhaseValue: moon.phase
  };
}

/**
 * Constructs the next 4-hour precipitation forecast timeline.
 *
 * @param {HourlyItem[]} hourlyList - Array of hourly forecasts starting from the current hour.
 * @returns {PrecipSlot[]} 5-slot precipitation horizon array (Now, +1h, +2h, +3h, +4h).
 */
export function buildPrecipitationTimeline(hourlyList: HourlyItem[]): PrecipSlot[] {
  return [
    { label: 'Now', prob: hourlyList[0]?.precipitationProbability || 0, amount: hourlyList[0]?.precipitationAmount || 0 },
    { label: '+1h', prob: hourlyList[1]?.precipitationProbability || 0, amount: hourlyList[1]?.precipitationAmount || 0 },
    { label: '+2h', prob: hourlyList[2]?.precipitationProbability || 0, amount: hourlyList[2]?.precipitationAmount || 0 },
    { label: '+3h', prob: hourlyList[3]?.precipitationProbability || 0, amount: hourlyList[3]?.precipitationAmount || 0 },
    { label: '+4h', prob: hourlyList[4]?.precipitationProbability || 0, amount: hourlyList[4]?.precipitationAmount || 0 }
  ];
}

/**
 * Synthesizes a 4-part diurnal progression story (Morning, Afternoon, Evening, Night).
 *
 * @param {HourlyItem[]} hourlyList - Hourly forecast items.
 * @param {DailyItem} [todayDaily] - Today's daily forecast object.
 * @returns {StoryData} The 4 chronological quarter chapters.
 */
export function buildStory(hourlyList: HourlyItem[], todayDaily?: DailyItem): StoryData {
  const findHour = (targetHour: number) => {
    return hourlyList.find(h => new Date(h.time).getHours() === targetHour) || hourlyList[0];
  };

  const morning = findHour(8);
  const afternoon = findHour(13);
  const evening = findHour(18);
  const night = findHour(22);

  const tMax = todayDaily ? todayDaily.tempMax : afternoon.temp;
  const tMin = todayDaily ? todayDaily.tempMin : night.temp;

  return {
    morning: {
      timeLabel: 'Morning',
      temp: morning.temp,
      condition: morning.conditionText,
      icon: morning.iconType,
      desc: `${morning.conditionText} with ${morning.humidity}% humidity and ${morning.windSpeed} km/h wind.`
    },
    afternoon: {
      timeLabel: 'Afternoon',
      temp: afternoon.temp,
      condition: afternoon.conditionText,
      icon: afternoon.iconType,
      desc: `Reaching day peak of ${tMax}°C with ${afternoon.precipitationProbability}% chance of rain.`
    },
    evening: {
      timeLabel: 'Evening',
      temp: evening.temp,
      condition: evening.conditionText,
      icon: evening.iconType,
      desc: `Cooling to ${evening.temp}°C under ${evening.conditionText.toLowerCase()} skies.`
    },
    night: {
      timeLabel: 'Night',
      temp: night.temp,
      condition: night.conditionText,
      icon: night.iconType,
      desc: `Overnight low dropping toward ${tMin}°C with calm winds.`
    }
  };
}

/**
 * Computes a multi-factor thermodynamic human comfort score (0 - 100).
 * Penalizes deviations from optimal thermal balance (18-25°C), high humidity,
 * extreme wind chill or gusts, and severe UV radiation.
 *
 * @param {number} tempC - Ambient temperature in Celsius.
 * @param {number} humidity - Relative humidity percentage.
 * @param {number} windKmH - Wind speed in km/h.
 * @param {number} uv - UV index.
 * @returns {ComfortData} The comfort score, category, and outdoor recommendation.
 */
export function calculateComfort(tempC: number, humidity: number, windKmH: number, uv: number): ComfortData {
  let penalty = 0;

  // Temperature penalty
  if (tempC < 18) {
    penalty += (18 - tempC) * 2.5;
  } else if (tempC > 25) {
    penalty += (tempC - 25) * 3.5;
  }

  // Humidity penalty
  if (humidity > 65) {
    penalty += (humidity - 65) * 0.8;
  } else if (humidity < 30) {
    penalty += (30 - humidity) * 0.5;
  }

  // Wind penalty
  if (windKmH > 35) {
    penalty += (windKmH - 35) * 0.7;
  }

  // UV radiation penalty
  if (uv > 7) {
    penalty += (uv - 7) * 3;
  }

  const score = Math.max(10, Math.min(100, Math.round(100 - penalty)));

  let category: ComfortData['category'] = 'Excellent';
  let title = 'Ideal Outdoor Conditions';
  let description = 'Temperature and humidity levels are in the optimal comfort range.';

  if (score < 40) {
    category = 'Uncomfortable';
    title = 'Challenging Conditions';
    description = tempC > 30 ? 'High heat and humidity; stay hydrated in shaded areas.' : 'Cold or gusty conditions; dress warmly.';
  } else if (score < 70) {
    category = 'Moderate';
    title = 'Fair Outdoor Comfort';
    description = humidity > 70 ? 'Muggy conditions with higher moisture levels.' : 'Pleasant with slight weather influence.';
  }

  return {
    score,
    category,
    title,
    description
  };
}

/**
 * Generates a concise, context-aware meteorological intelligence summary.
 * Prioritizes active precipitation, incoming rain events, severe wind gusts,
 * extreme UV exposure, and diurnal thermal swings.
 *
 * @param {CurrentWeather} current - Current weather telemetry.
 * @param {HourlyItem[]} hourlyList - Hourly forecast array.
 * @param {DailyItem[]} dailyList - Daily forecast array.
 * @returns {string} Natural language meteorological briefing.
 */
export function generateIntelligenceSummary(
  current: CurrentWeather,
  hourlyList: HourlyItem[],
  dailyList: DailyItem[]
): string {
  const nextRainHour = hourlyList.slice(0, 12).find(h => h.precipitationProbability >= 40);
  const peakWindHour = hourlyList.slice(0, 12).reduce((max, h) => (h.windGusts > max.windGusts ? h : max), hourlyList[0]);
  const maxUvToday = dailyList[0]?.uvIndexMax || 0;

  if (current.precipitation > 0 || current.conditionCategory === 'rain') {
    return `Rain currently occurring. Conditions are expected to ease later today with a high of ${current.tempMax}°.`;
  }

  if (nextRainHour) {
    const timeStr = new Date(nextRainHour.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${nextRainHour.conditionText} is expected around ${timeStr} (${nextRainHour.precipitationProbability}% probability).`;
  }

  if (peakWindHour && peakWindHour.windGusts >= 40) {
    return `Breezy conditions today with wind gusts peaking near ${peakWindHour.windGusts} km/h this afternoon.`;
  }

  if (maxUvToday >= 8) {
    return `Very high UV levels (index ${maxUvToday}) expected midday. Sun protection is recommended outdoors.`;
  }

  if (current.tempMax - current.tempMin >= 10) {
    return `Wide temperature swing today: climbing from a low of ${current.tempMin}° to a peak of ${current.tempMax}°.`;
  }

  return `${current.conditionText} skies through today. High of ${current.tempMax}°, dipping to ${current.tempMin}° tonight.`;
}

/**
 * Converts temperatures between Celsius and Fahrenheit.
 *
 * @param {number} tempC - Temperature in Celsius.
 * @param {'C' | 'F'} [unit='C'] - Desired output scale.
 * @returns {number} Formatted rounded integer temperature.
 */
export function formatTemperature(tempC: number, unit: 'C' | 'F' = 'C'): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

/**
 * Converts wind velocities between metric km/h, imperial mph, and nautical knots.
 *
 * @param {number} speedKmH - Wind velocity in km/h.
 * @param {'km/h' | 'mph' | 'knots'} [unit='km/h'] - Desired output unit.
 * @returns {number} Formatted rounded wind velocity.
 */
export function formatWindSpeed(speedKmH: number, unit: 'km/h' | 'mph' | 'knots' = 'km/h'): number {
  if (unit === 'mph') return Math.round(speedKmH * 0.621371);
  if (unit === 'knots') return Math.round(speedKmH * 0.539957);
  return Math.round(speedKmH);
}

/**
 * Converts compass degrees (0° to 360°) to a 16-point cardinal direction string.
 *
 * @param {number} deg - Meteorological wind direction angle in degrees (0° = North).
 * @returns {string} Cardinal label (e.g. 'N', 'NE', 'SSW', 'NW').
 */
export function getCardinalDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return directions[idx];
}
