'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Location } from '../../types/weather';
import { WeatherAPI } from '../../services/weatherApi';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    setCurrentCity,
    savedLocations,
    removeSavedLocation,
    recentSearches,
    clearRecentSearches,
    showToast
  } = useWeather();

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const res = await WeatherAPI.searchLocations(query);
      setResults(res);
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelect = (city: Location) => {
    setCurrentCity(city);
    setSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!results.length) return;
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (results[0]) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const city = await WeatherAPI.reverseGeocode(lat, lon);
          handleSelect(city);
          showToast(`Detected location: ${city.name}`, 'success');
        } catch (err) {
          console.warn('Geolocation reverse geocode error:', err);
          showToast('Failed to resolve coordinates to a city.', 'error');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        showToast('Location access denied. Please search for your city name.', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/75 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSearchOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search city"
    >
      <div className="w-full max-w-lg bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-6 mt-8 sm:mt-16 flex flex-col gap-4 animate-slide-up backdrop-blur-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black text-white">Search Global Locations</h2>
          <button
            className="glass-btn w-8 h-8 text-white/60 hover:text-white"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            &times;
          </button>
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-black/40 border border-white/15 focus-within:border-sky-400 transition-colors">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-white/40 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or country..."
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-white placeholder-white/40 outline-none"
          />
          {query && (
            <button
              className="text-white/40 hover:text-white text-lg font-bold"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
            >
              &times;
            </button>
          )}
        </div>

        {/* Geolocation Button */}
        <button
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 font-bold text-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          onClick={handleGeolocation}
          disabled={isLocating}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
          </svg>
          <span>{isLocating ? 'Determining GPS Coordinates...' : 'Use Precise Current Location'}</span>
        </button>

        {/* Autocomplete List */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {isSearching && (
            <div className="p-3 text-center text-xs font-semibold text-white/40">
              Querying international geospatial database...
            </div>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <div className="p-3 text-center text-xs font-semibold text-white/40">
              No matching locations found. Check spelling or try a major city.
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${selectedIndex === idx ? 'bg-white/15' : 'hover:bg-white/[0.08]'}`}
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-bold text-white">{item.name}</span>
                {item.admin1 && <span className="text-xs text-white/50">{item.admin1}</span>}
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-white/10 text-white/80">
                {item.countryCode || item.country}
              </span>
            </div>
          ))}
        </div>

        {/* Saved Locations */}
        {savedLocations.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Saved Favorites</span>
            <div className="flex flex-wrap gap-2">
              {savedLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="glass-btn px-3 py-1.5 text-xs font-bold text-white gap-1.5 cursor-pointer hover:border-sky-400/50"
                  onClick={() => handleSelect(loc)}
                >
                  <span>{loc.name}</span>
                  <span className="text-[10px] text-white/40">({loc.countryCode || loc.country})</span>
                  <button
                    className="text-white/40 hover:text-rose-400 ml-1 text-sm font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedLocation(idx);
                    }}
                    title="Remove location"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Recent Inquiries</span>
              <button
                className="text-sky-400 hover:text-sky-300 text-xs font-bold"
                onClick={clearRecentSearches}
              >
                Clear History
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {recentSearches.map((loc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors"
                  onClick={() => handleSelect(loc)}
                >
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs font-bold text-white">{loc.name}</span>
                    {loc.admin1 && <span className="text-[11px] text-white/45">{loc.admin1}</span>}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                    {loc.countryCode || loc.country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
