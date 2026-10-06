export interface Location {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  tag?: string;
  population?: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  dewPoint: number;
  pressure: number;
  pressureTrend: 'Steady' | 'Rising' | 'Falling';
  visibility: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  cloudCover: number;
  precipitation: number;
  isDay: boolean;
  conditionCode: number;
  conditionText: string;
  conditionCategory: 'clear' | 'clouds' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
  iconType: string;
  lastUpdated: Date;
}

export interface HourlyItem {
  time: Date;
  formattedTime: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitationAmount: number;
  conditionCode: number;
  conditionText: string;
  iconType: string;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  cloudCover: number;
  isDay: boolean;
}

export interface RangeBarInfo {
  left: number;
  width: number;
  currentPos: number | null;
}

export interface DailyItem {
  date: Date;
  dayName: string;
  fullDate: string;
  isToday: boolean;
  tempMin: number;
  tempMax: number;
  apparentMin: number;
  apparentMax: number;
  conditionCode: number;
  conditionText: string;
  iconType: string;
  precipProbability: number;
  precipSum: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirection: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  daylightHours: number;
  rangeBar: RangeBarInfo;
}

export interface AQIData {
  aqi: number;
  usAqi: number;
  europeanAqi: number;
  status: string;
  statusClass: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy';
  advice: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
}

export interface SunMoonData {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  sunPositionPercent: number;
  isDay: boolean;
  daylightHours: number;
  moonPhaseName: string;
  moonIllumination: number;
  moonPhaseValue: number;
}

export interface PrecipSlot {
  label: string;
  prob: number;
  amount: number;
}

export interface StorySlot {
  timeLabel: string;
  temp: number;
  condition: string;
  icon: string;
  desc: string;
}

export interface StoryData {
  morning: StorySlot;
  afternoon: StorySlot;
  evening: StorySlot;
  night: StorySlot;
}

export interface ComfortData {
  score: number;
  category: 'Excellent' | 'Moderate' | 'Uncomfortable';
  title: string;
  description: string;
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyItem[];
  daily: DailyItem[];
  aqi: AQIData;
  sunMoon: SunMoonData;
  precipTimeline: PrecipSlot[];
  story: StoryData;
  comfort: ComfortData;
  intelligenceSummary: string;
}

export interface Settings {
  tempUnit: 'C' | 'F';
  windUnit: 'km/h' | 'mph' | 'knots';
  pressureUnit: 'hPa' | 'inHg';
  timeFormat: '12h' | '24h';
  theme: 'system' | 'dark' | 'light';
  atmosphere: 'full' | 'reduced' | 'off';
  provider: 'open-meteo' | 'openweather';
}

export type GraphMetric = 'temp' | 'precip' | 'wind';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
