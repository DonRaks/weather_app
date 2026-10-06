import { Location, Settings } from '../types/weather';

export const CONFIG = {
  APP_NAME: 'Aura Weather',
  VERSION: '2.0.0',
  DEFAULT_CITY: {
    name: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    admin1: 'Lagos State',
    latitude: 6.5244,
    longitude: 3.3792,
    timezone: 'Africa/Lagos'
  } as Location,
  DEFAULT_SAVED_LOCATIONS: [
    { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', latitude: 6.5244, longitude: 3.3792, tag: 'Home' },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, tag: 'Work' },
    { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, tag: 'Favorite' },
    { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, tag: 'Travel' }
  ] as Location[],
  DEFAULT_SETTINGS: {
    tempUnit: 'C',
    windUnit: 'km/h',
    pressureUnit: 'hPa',
    timeFormat: '12h',
    theme: 'dark',
    atmosphere: 'full',
    provider: 'open-meteo'
  } as Settings,
  OPENWEATHER_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '8c900f3e949f21d5afdab9d2e89ea5e4',
  STORAGE_KEYS: {
    SETTINGS: 'aura_weather_settings_v2',
    SAVED_LOCATIONS: 'aura_weather_saved_locations_v2',
    RECENT_SEARCHES: 'aura_weather_recent_searches_v2',
    LAST_LOCATION: 'aura_weather_last_location_v2',
    CACHED_WEATHER: 'aura_weather_cached_data_v2'
  }
};

export interface WMOInfo {
  label: string;
  category: 'clear' | 'clouds' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
  dayIcon: string;
  nightIcon: string;
}

export const WMO_CODES: Record<number, WMOInfo> = {
  0: { label: 'Clear Sky', category: 'clear', icon: 'sun', dayIcon: 'sun', nightIcon: 'moon' },
  1: { label: 'Mainly Clear', category: 'clear', icon: 'sun-cloud', dayIcon: 'sun-cloud', nightIcon: 'moon-cloud' },
  2: { label: 'Partly Cloudy', category: 'clouds', icon: 'cloud-sun', dayIcon: 'cloud-sun', nightIcon: 'cloud-moon' },
  3: { label: 'Overcast', category: 'clouds', icon: 'cloud', dayIcon: 'cloud', nightIcon: 'cloud' },
  45: { label: 'Foggy', category: 'fog', icon: 'fog', dayIcon: 'fog', nightIcon: 'fog' },
  48: { label: 'Depositing Rime Fog', category: 'fog', icon: 'fog', dayIcon: 'fog', nightIcon: 'fog' },
  51: { label: 'Light Drizzle', category: 'rain', icon: 'drizzle', dayIcon: 'drizzle', nightIcon: 'drizzle' },
  53: { label: 'Moderate Drizzle', category: 'rain', icon: 'drizzle', dayIcon: 'drizzle', nightIcon: 'drizzle' },
  55: { label: 'Dense Drizzle', category: 'rain', icon: 'drizzle', dayIcon: 'drizzle', nightIcon: 'drizzle' },
  56: { label: 'Freezing Drizzle', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  57: { label: 'Heavy Freezing Drizzle', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  61: { label: 'Slight Rain', category: 'rain', icon: 'rain', dayIcon: 'rain', nightIcon: 'rain' },
  63: { label: 'Moderate Rain', category: 'rain', icon: 'rain-heavy', dayIcon: 'rain-heavy', nightIcon: 'rain-heavy' },
  65: { label: 'Heavy Rain', category: 'rain', icon: 'rain-heavy', dayIcon: 'rain-heavy', nightIcon: 'rain-heavy' },
  66: { label: 'Freezing Rain', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  67: { label: 'Heavy Freezing Rain', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  71: { label: 'Slight Snow Fall', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  73: { label: 'Moderate Snow Fall', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  75: { label: 'Heavy Snow Fall', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  77: { label: 'Snow Grains', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  80: { label: 'Slight Showers', category: 'rain', icon: 'rain', dayIcon: 'rain', nightIcon: 'rain' },
  81: { label: 'Moderate Showers', category: 'rain', icon: 'rain-heavy', dayIcon: 'rain-heavy', nightIcon: 'rain-heavy' },
  82: { label: 'Violent Showers', category: 'rain', icon: 'rain-heavy', dayIcon: 'rain-heavy', nightIcon: 'rain-heavy' },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  86: { label: 'Heavy Snow Showers', category: 'snow', icon: 'snow', dayIcon: 'snow', nightIcon: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunderstorm', icon: 'thunder', dayIcon: 'thunder', nightIcon: 'thunder' },
  96: { label: 'Thunderstorm with Hail', category: 'thunderstorm', icon: 'thunder', dayIcon: 'thunder', nightIcon: 'thunder' },
  99: { label: 'Severe Thunderstorm', category: 'thunderstorm', icon: 'thunder', dayIcon: 'thunder', nightIcon: 'thunder' }
};
