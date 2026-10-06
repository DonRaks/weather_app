'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Location, WeatherData, Settings, GraphMetric, ToastMessage } from '../types/weather';
import { CONFIG } from '../utils/constants';
import { getStoredJSON, setStoredJSON } from '../utils/storage';
import { WeatherAPI } from '../services/weatherApi';

/**
 * WeatherContext Type Definition
 *
 * Defines the complete state contract and action dispatches for the Aura Weather application.
 */
interface WeatherContextType {
  /** The currently active target location */
  currentCity: Location;
  /** Full meteorological data payload for the active location */
  weatherData: WeatherData | null;
  /** Optional secondary location selected for comparison */
  comparisonCity: Location | null;
  /** Telemetry data payload for the comparison location */
  comparisonData: WeatherData | null;
  /** User configurable settings and preferences */
  settings: Settings;
  /** Saved favorite locations */
  savedLocations: Location[];
  /** Search history */
  recentSearches: Location[];
  /** The active metric displayed on the trend chart ('temp' | 'precip' | 'wind' | 'humidity' | 'uv') */
  activeGraphMetric: GraphMetric;
  /** The index of the selected hour in the 24-hour timeline inspector */
  selectedHourIndex: number;
  /** Global loading state */
  isLoading: boolean;
  /** Global error message or null */
  error: string | null;

  /** Search modal visibility state */
  isSearchOpen: boolean;
  /** Settings modal visibility state */
  isSettingsOpen: boolean;
  /** Comparison modal visibility state */
  isCompareOpen: boolean;
  /** Toast notifications queue */
  toasts: ToastMessage[];

  // Action Dispatchers
  /** Sets the active city, updates storage, and fetches latest telemetry */
  setCurrentCity: (city: Location) => void;
  /** Updates application preferences in state and local storage */
  updateSettings: (newSettings: Partial<Settings>) => void;
  /** Quick toggle between Celsius and Fahrenheit */
  toggleTempUnit: () => void;
  /** Adds a location to the user's saved favorites */
  addSavedLocation: (city: Location, tag?: string) => void;
  /** Removes a location from saved favorites by index */
  removeSavedLocation: (index: number) => void;
  /** Clears the user's recent search history */
  clearRecentSearches: () => void;
  /** Updates the active trend chart metric */
  setActiveGraphMetric: (metric: GraphMetric) => void;
  /** Updates the selected hour in the hourly inspector */
  setSelectedHourIndex: (index: number) => void;
  /** Controls search modal visibility */
  setSearchOpen: (open: boolean) => void;
  /** Controls settings modal visibility */
  setSettingsOpen: (open: boolean) => void;
  /** Controls comparison modal visibility */
  setCompareOpen: (open: boolean) => void;
  /** Dispatches a floating toast notification */
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  /** Dismisses a toast notification by ID */
  removeToast: (id: string) => void;
  /** Refreshes current city telemetry from live APIs */
  refreshWeather: () => Promise<void>;
  /** Fetches weather for comparison city */
  fetchComparisonWeather: (city: Location) => Promise<WeatherData | null>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

/**
 * WeatherProvider Component
 *
 * Provides centralized state management, data persistence, network synchronization,
 * theme management, and DOM attribute reflection for Aura Weather.
 *
 * @component
 * @param {{ children: ReactNode }} props - React component children.
 * @returns {React.ReactElement} The Context Provider wrapping children.
 */
export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [currentCity, setCurrentCityState] = useState<Location>(CONFIG.DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [comparisonCity, setComparisonCity] = useState<Location | null>(null);
  const [comparisonData, setComparisonData] = useState<WeatherData | null>(null);
  const [settings, setSettings] = useState<Settings>(CONFIG.DEFAULT_SETTINGS);
  const [savedLocations, setSavedLocations] = useState<Location[]>(CONFIG.DEFAULT_SAVED_LOCATIONS);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [activeGraphMetric, setActiveGraphMetric] = useState<GraphMetric>('temp');
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isCompareOpen, setCompareOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize stored state on client mount
  useEffect(() => {
    const storedSettings = getStoredJSON<Settings>(CONFIG.STORAGE_KEYS.SETTINGS, CONFIG.DEFAULT_SETTINGS);
    const storedSaved = getStoredJSON<Location[]>(CONFIG.STORAGE_KEYS.SAVED_LOCATIONS, CONFIG.DEFAULT_SAVED_LOCATIONS);
    const storedRecent = getStoredJSON<Location[]>(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, []);
    const storedLast = getStoredJSON<Location>(CONFIG.STORAGE_KEYS.LAST_LOCATION, CONFIG.DEFAULT_CITY);

    setSettings(storedSettings);
    setSavedLocations(storedSaved);
    setRecentSearches(storedRecent);
    setCurrentCityState(storedLast);
  }, []);

  // Sync theme attribute to HTML document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // Sync active weather condition category to HTML document root for ambient shader lighting
  useEffect(() => {
    if (typeof document === 'undefined' || !weatherData) return;
    const cur = weatherData.current;
    let condKey = 'clear-day';

    if (cur.conditionCategory === 'thunderstorm') {
      condKey = 'thunderstorm';
    } else if (cur.conditionCategory === 'rain') {
      condKey = 'rain';
    } else if (cur.conditionCategory === 'snow') {
      condKey = 'snow';
    } else if (cur.conditionCategory === 'fog') {
      condKey = 'fog';
    } else if (cur.conditionCategory === 'clouds') {
      condKey = cur.isDay ? 'cloudy-day' : 'cloudy-night';
    } else {
      condKey = cur.isDay ? 'clear-day' : 'clear-night';
    }

    document.documentElement.setAttribute('data-weather', condKey);
  }, [weatherData]);

  // Toast notification dispatcher with auto-dismissal
  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Loads weather telemetry for a target location
  const loadCityWeather = useCallback(async (city: Location) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await WeatherAPI.fetchFullWeather(city);
      setWeatherData(data);
      setSelectedHourIndex(0);
      setStoredJSON(CONFIG.STORAGE_KEYS.CACHED_WEATHER, data);
    } catch (err) {
      console.error('Failed to load weather:', err);
      const errMsg = `Unable to retrieve live forecast for ${city.name}. Please check connection.`;
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Handle active city selection
  const setCurrentCity = useCallback((city: Location) => {
    setCurrentCityState(city);
    setStoredJSON(CONFIG.STORAGE_KEYS.LAST_LOCATION, city);

    // Update recent searches list (max 8 items, deduplicated)
    setRecentSearches(prev => {
      const filtered = prev.filter(
        item => !(item.name === city.name && item.country === city.country)
      );
      const updated = [city, ...filtered].slice(0, 8);
      setStoredJSON(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, updated);
      return updated;
    });

    loadCityWeather(city);
  }, [loadCityWeather]);

  // Refresh active location data
  const refreshWeather = useCallback(async () => {
    await loadCityWeather(currentCity);
  }, [currentCity, loadCityWeather]);

  // Fetch comparison weather helper
  const fetchComparisonWeather = useCallback(async (city: Location): Promise<WeatherData | null> => {
    try {
      const data = await WeatherAPI.fetchFullWeather(city);
      setComparisonCity(city);
      setComparisonData(data);
      return data;
    } catch (e) {
      console.warn('Comparison fetch error:', e);
      return null;
    }
  }, []);

  // Initial load on mount or coordinate shift
  useEffect(() => {
    loadCityWeather(currentCity);
  }, [currentCity.latitude, currentCity.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preferences update handler
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      setStoredJSON(CONFIG.STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
  }, []);

  const toggleTempUnit = useCallback(() => {
    updateSettings({ tempUnit: settings.tempUnit === 'C' ? 'F' : 'C' });
  }, [settings.tempUnit, updateSettings]);

  // Saved location favorites handler
  const addSavedLocation = useCallback((city: Location, tag = 'Favorite') => {
    setSavedLocations(prev => {
      const exists = prev.some(
        loc => Math.abs(loc.latitude - city.latitude) < 0.05 && Math.abs(loc.longitude - city.longitude) < 0.05
      );
      if (exists) return prev;
      const updated = [...prev, { ...city, tag }];
      setStoredJSON(CONFIG.STORAGE_KEYS.SAVED_LOCATIONS, updated);
      return updated;
    });
    showToast(`Saved ${city.name} to favorites!`, 'success');
  }, [showToast]);

  const removeSavedLocation = useCallback((index: number) => {
    setSavedLocations(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setStoredJSON(CONFIG.STORAGE_KEYS.SAVED_LOCATIONS, updated);
      return updated;
    });
    showToast('Location removed from favorites', 'info');
  }, [showToast]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    setStoredJSON(CONFIG.STORAGE_KEYS.RECENT_SEARCHES, []);
    showToast('Cleared recent searches', 'info');
  }, [showToast]);

  return (
    <WeatherContext.Provider
      value={{
        currentCity,
        weatherData,
        comparisonCity,
        comparisonData,
        settings,
        savedLocations,
        recentSearches,
        activeGraphMetric,
        selectedHourIndex,
        isLoading,
        error,
        isSearchOpen,
        isSettingsOpen,
        isCompareOpen,
        toasts,
        setCurrentCity,
        updateSettings,
        toggleTempUnit,
        addSavedLocation,
        removeSavedLocation,
        clearRecentSearches,
        setActiveGraphMetric,
        setSelectedHourIndex,
        setSearchOpen,
        setSettingsOpen,
        setCompareOpen,
        showToast,
        removeToast,
        refreshWeather,
        fetchComparisonWeather
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

/**
 * Custom hook to access the Aura Weather context.
 *
 * @throws {Error} If called outside of a `<WeatherProvider />` tree.
 * @returns {WeatherContextType} The active weather context state and actions.
 */
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
