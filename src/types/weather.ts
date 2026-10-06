/**
 * ==============================================================================
 * AURA WEATHER — DOMAIN TYPE DEFINITIONS
 * ==============================================================================
 * Comprehensive TypeScript interfaces and models for meteorological datasets,
 * location coordinates, atmospheric telemetry, user preferences, and state.
 */

/**
 * Geographical coordinate and metadata for a city/location
 */
export interface Location {
  name: string;           // Primary municipality name (e.g., "Tokyo")
  country: string;        // Full country name (e.g., "Japan")
  countryCode: string;    // ISO 3166-1 alpha-2 code (e.g., "JP")
  admin1?: string;        // State/Province/Prefecture (e.g., "Tokyo Prefecture")
  latitude: number;       // Geographic latitude in decimal degrees
  longitude: number;      // Geographic longitude in decimal degrees
  timezone?: string;      // IANA Timezone identifier (e.g., "Asia/Tokyo")
  tag?: string;           // Custom user label (e.g., "Home", "Favorite")
  population?: number;    // Estimated population
}

/**
 * Snapshot of real-time current weather metrics
 */
export interface CurrentWeather {
  temp: number;               // Current air temperature at 2m (°C)
  feelsLike: number;          // Apparent temperature factoring wind/humidity (°C)
  tempMin: number;            // Daily forecasted minimum temperature (°C)
  tempMax: number;            // Daily forecasted maximum temperature (°C)
  humidity: number;           // Relative humidity percentage (0-100%)
  dewPoint: number;           // Atmospheric dew point (°C)
  pressure: number;           // Mean sea level barometric pressure (hPa)
  pressureTrend: 'Steady' | 'Rising' | 'Falling'; // 3-hour barometric trajectory
  visibility: number;         // Optical visibility distance (km)
  windSpeed: number;          // Wind speed at 10m altitude (km/h)
  windDirection: number;      // Wind azimuth angle (0-360 degrees)
  windGusts: number;          // Maximum instantaneous wind gust speed (km/h)
  uvIndex: number;            // UV radiation index (0 to 11+)
  cloudCover: number;         // Total cloud cover fraction (0-100%)
  precipitation: number;      // Current liquid precipitation rate (mm)
  isDay: boolean;             // True if sun is above horizon
  conditionCode: number;      // WMO standard weather interpretation code
  conditionText: string;      // Human-readable condition label (e.g., "Partly Cloudy")
  conditionCategory: 'clear' | 'clouds' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
  iconType: string;           // Identifier for vector SVG icon mapping
  lastUpdated: Date;          // Timestamp of the latest API ingestion
}

/**
 * Hourly meteorological snapshot across a 24-hour horizon
 */
export interface HourlyItem {
  time: Date;                         // Absolute timestamp
  formattedTime: string;              // Localized display time (e.g., "3 PM" or "Now")
  temp: number;                       // Air temperature (°C)
  feelsLike: number;                  // Apparent temperature (°C)
  humidity: number;                   // Relative humidity (%)
  dewPoint: number;                   // Dew point (°C)
  precipitationProbability: number;   // Rain probability (0-100%)
  precipitationAmount: number;        // Estimated precipitation volume (mm)
  conditionCode: number;              // WMO weather code
  conditionText: string;              // Descriptive condition text
  iconType: string;                   // Vector icon identifier
  windSpeed: number;                  // Wind speed (km/h)
  windDirection: number;              // Wind direction (degrees)
  windGusts: number;                  // Peak wind gusts (km/h)
  uvIndex: number;                    // Solar UV radiation index
  cloudCover: number;                 // Cloud coverage percentage (0-100%)
  isDay: boolean;                     // Day/Night indicator
}

/**
 * Positional metadata for normalized temperature range spectrum bars
 */
export interface RangeBarInfo {
  left: number;               // Left margin percentage of 10-day weekly scale (0-100%)
  width: number;              // Width percentage of the day's temperature span (min-to-max)
  currentPos: number | null;  // Position percentage of current live temperature dot (Today only)
}

/**
 * Daily forecast item for the 10-day extended outlook
 */
export interface DailyItem {
  date: Date;                         // Calendar date
  dayName: string;                    // Short day name (e.g., "Mon", "Today")
  fullDate: string;                   // Formatted month and day (e.g., "Oct 6")
  isToday: boolean;                   // Flag indicating if item represents the current day
  tempMin: number;                    // Minimum predicted temperature (°C)
  tempMax: number;                    // Maximum predicted temperature (°C)
  apparentMin: number;                // Minimum apparent temperature (°C)
  apparentMax: number;                // Maximum apparent temperature (°C)
  conditionCode: number;              // WMO weather code
  conditionText: string;              // Human-readable condition label
  iconType: string;                   // Icon symbol identifier
  precipProbability: number;          // Maximum rain probability percentage
  precipSum: number;                  // Cumulative 24-hour precipitation sum (mm)
  windSpeedMax: number;               // Maximum daily sustained wind speed (km/h)
  windGustsMax: number;               // Peak wind gust velocity (km/h)
  windDirection: number;              // Dominant wind direction (degrees)
  uvIndexMax: number;                 // Maximum midday UV index
  sunrise: string;                    // Sunrise time string (e.g., "06:42 AM")
  sunset: string;                     // Sunset time string (e.g., "06:18 PM")
  daylightHours: number;              // Total solar daylight duration in hours
  rangeBar: RangeBarInfo;             // Normalized Apple Weather style range spectrum bar
}

/**
 * Air Quality Index (AQI) and pollutant concentrations
 */
export interface AQIData {
  aqi: number;                        // Primary AQI value (US AQI standard)
  usAqi: number;                      // EPA US AQI (0-500 scale)
  europeanAqi: number;                // European standard AQI
  status: string;                     // Categorical status (e.g., "Good", "Moderate")
  statusClass: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy';
  advice: string;                     // Contextual health advisory text
  pm2_5: number;                      // Fine inhalable particulate matter (µg/m³)
  pm10: number;                       // Inhalable particulate matter (µg/m³)
  no2: number;                        // Nitrogen Dioxide concentration (µg/m³)
  o3: number;                         // Surface Ozone concentration (µg/m³)
  co: number;                         // Carbon Monoxide concentration (µg/m³)
}

/**
 * Astronomical solar trajectory and lunar phase ephemeris
 */
export interface SunMoonData {
  sunrise: string;                    // Localized sunrise time string
  sunset: string;                     // Localized sunset time string
  solarNoon: string;                  // Highest solar altitude time string
  sunPositionPercent: number;         // 0-100% position along the quadratic Bezier arc
  isDay: boolean;                     // Solar daylight indicator
  daylightHours: number;              // Total solar illumination hours
  moonPhaseName: string;              // Phase name (e.g., "Waxing Gibbous", "Full Moon")
  moonIllumination: number;           // Moon illuminated surface fraction (0-100%)
  moonPhaseValue: number;             // Julian day cycle progress (0.0 to 1.0)
}

/**
 * Precipitation timeline slice for short-term horizon
 */
export interface PrecipSlot {
  label: string;                      // Time delta label (e.g., "Now", "+1h", "+2h")
  prob: number;                       // Rain probability percentage (0-100%)
  amount: number;                     // Expected precipitation volume (mm)
}

/**
 * Chronological diurnal progression breakdown
 */
export interface StorySlot {
  timeLabel: string;                  // Stage label ("Morning", "Afternoon", "Evening", "Night")
  temp: number;                       // Predicted stage temperature (°C)
  condition: string;                  // Dominant weather state
  icon: string;                       // Condition icon
  desc: string;                       // Descriptive narrative sentence
}

/**
 * 4-part diurnal story narrative
 */
export interface StoryData {
  morning: StorySlot;
  afternoon: StorySlot;
  evening: StorySlot;
  night: StorySlot;
}

/**
 * Bio-comfort score based on humidity, temperature, wind, and UV
 */
export interface ComfortData {
  score: number;                      // 0 to 100 numerical comfort index
  category: 'Excellent' | 'Moderate' | 'Uncomfortable';
  title: string;                      // Headline rating
  description: string;                // Detailed ergonomic advisory
}

/**
 * Unified root domain payload combining all atmospheric layers
 */
export interface WeatherData {
  location: Location;                 // Geographic location data
  current: CurrentWeather;            // Real-time current metrics
  hourly: HourlyItem[];               // 24-hour horizon array
  daily: DailyItem[];                 // 10-day extended horizon array
  aqi: AQIData;                       // Air quality and pollutant metrics
  sunMoon: SunMoonData;               // Solar and lunar ephemeris
  precipTimeline: PrecipSlot[];       // 4-hour precipitation bar chart data
  story: StoryData;                   // 4-stage diurnal progression
  comfort: ComfortData;               // Bio-comfort rating
  intelligenceSummary: string;        // Natural language deterministic briefing
}

/**
 * Global user preferences and runtime configurations
 */
export interface Settings {
  tempUnit: 'C' | 'F';                // Temperature scale
  windUnit: 'km/h' | 'mph' | 'knots'; // Wind velocity measurement
  pressureUnit: 'hPa' | 'inHg';       // Barometric pressure unit
  timeFormat: '12h' | '24h';          // Astronomical clock notation
  theme: 'system' | 'dark' | 'light'; // UI luminance theme
  atmosphere: 'full' | 'reduced' | 'off'; // GPU Canvas particle effect level
  provider: 'open-meteo' | 'openweather'; // Upstream data provider
}

/**
 * Active metric mode for interactive chart scrubber
 */
export type GraphMetric = 'temp' | 'precip' | 'wind';

/**
 * Asynchronous toast notification item
 */
export interface ToastMessage {
  id: string;                         // Unique identifier
  message: string;                    // Alert message text
  type: 'info' | 'success' | 'error'; // Visual severity tier
}
