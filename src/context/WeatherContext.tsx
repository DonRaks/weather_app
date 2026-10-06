'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Location, WeatherData, Settings, GraphMetric, ToastMessage } from '../types/weather';
import { CONFIG } from '../utils/constants';
import { getStoredJSON, setStoredJSON } from '../utils/storage';
import { WeatherAPI } from '../services/weatherApi';

interface WeatherContextType {
  currentCity: Location;
  weatherData: WeatherData | null;
  comparisonCity: Location | null;
  comparisonData: WeatherData | null;
  settings: Settings;
  savedLocations: Location[];
  recentSearches: Location[];
  activeGraphMetric: GraphMetric;
  selectedHourIndex: number;
  isLoading: boolean;
  error: string | null;
  isSearchOpen: boolean;
  isSettingsOpen: boolean;
  isCompareOpen: boolean;
  toasts: ToastMessage[];

  // Actions
  setCurrentCity: (city: Location) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleTempUnit: () => void;
  addSavedLocation: (city: Location, tag?: string) => void;
  removeSavedLocation: (index: number) => void;
  clearRecentSearches: () => void;
  setActiveGraphMetric: (metric: GraphMetric) => void;
  setSelectedHourIndex: (index: number) => void;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;
  refreshWeather: () => Promise<void>;
  fetchComparisonWeather: (city: Location) => Promise<WeatherData | null>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

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

  // Sync theme attribute to HTML tag
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // Sync weather data condition to HTML data-weather
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

  // Toast notifications handler
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

  // Fetch city weather
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

  // Handle current city change
  const setCurrentCity = useCallback((city: Location) => {
    setCurrentCityState(city);
    setStoredJSON(CONFIG.STORAGE_KEYS.LAST_LOCATION, city);

    // Update recent searches
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

  // Refresh current city
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

  // Initial load
  useEffect(() => {
    loadCityWeather(currentCity);
  }, [currentCity.latitude, currentCity.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  // Settings update
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

  // Saved locations
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

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
