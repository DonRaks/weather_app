'use client';

import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherIcon } from '../ui/WeatherIcon';
import { formatTemperature } from '../../utils/meteorology';

/**
 * ==============================================================================
 * HERO SECTION COMPONENT (Primary Real-Time Meteorological Display)
 * ==============================================================================
 * Primary focal point of the application containing:
 * - Active Location & Country Badge
 * - Real-Time Astronomical Clock with pulsing live status indicator
 * - Large fluid typography temperature hero display
 * - Weather condition badge with vector SVG iconography
 * - High / Low / Feels-like apparent temperature chips
 * - Favorite location bookmark button
 * - Deterministic AI Natural Language Meteorological Briefing Card
 *
 * Fully optimized for mobile screens (320px+) with zero layout shifts or overflow.
 */
export const HeroSection: React.FC = () => {
  const { weatherData, currentCity, settings, addSavedLocation } = useWeather();
  const [timeStr, setTimeStr] = useState<string>('');

  /**
   * Ticks a 1-second live clock synchronized with local device time
   */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      setTimeStr(`${date} • ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) return null;

  const { current, intelligenceSummary, location } = weatherData;
  const tempUnit = settings.tempUnit;

  // Format temperatures according to the user's active unit preference (°C or °F)
  const displayTemp = formatTemperature(current.temp, tempUnit);
  const displayHigh = formatTemperature(current.tempMax, tempUnit);
  const displayLow = formatTemperature(current.tempMin, tempUnit);
  const displayFeels = formatTemperature(current.feelsLike, tempUnit);

  return (
    <section className="flex flex-col items-center text-center pt-1 sm:pt-2 pb-4 sm:pb-6 relative mb-4 sm:mb-6" aria-label="Current weather conditions">
      {/* 1. City Title & Regional Country Badge */}
      <div className="flex items-center justify-center gap-2 mb-1 flex-wrap px-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
          {location.name}
        </h1>
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 uppercase tracking-wider">
          {location.countryCode || location.country}
        </span>
      </div>

      {/* 2. Live Synchronized Astronomical Clock */}
      <div className="text-xs sm:text-sm font-medium text-white/70 mb-2 sm:mb-3 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399] animate-pulse-glow flex-shrink-0" />
        <span className="truncate">{timeStr || 'Synchronizing astronomical time...'}</span>
      </div>

      {/* 3. Main Temperature Hero Display */}
      <div className="relative inline-flex items-start justify-center my-1 sm:my-2">
        <span className="font-display text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl select-none leading-none">
          {displayTemp}
        </span>
        <span className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-sky-400 mt-1 sm:mt-3 ml-0.5 sm:ml-1">
          °{tempUnit}
        </span>
      </div>

      {/* 4. Weather Condition Pill with SVG Icon */}
      <div className="flex flex-col items-center gap-2 mb-4 sm:mb-5">
        <div className="glass-btn px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-lg font-bold text-white shadow-glass gap-2 border-white/15">
          <span className="flex-shrink-0 drop-shadow">
            <WeatherIcon type={current.iconType} size={24} />
          </span>
          <span>{current.conditionText}</span>
        </div>
      </div>

      {/* 5. Metrics Chips: High / Low / Feels-Like / Bookmark */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap mb-4 sm:mb-6 max-w-xl px-1">
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>High</span>
          <strong className="text-amber-400 font-extrabold">{displayHigh}°</strong>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>Low</span>
          <strong className="text-sky-400 font-extrabold">{displayLow}°</strong>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>Feels</span>
          <strong className="text-white font-extrabold">{displayFeels}°</strong>
        </div>
        <button
          className="glass-btn px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white/90 hover:text-white gap-1 cursor-pointer shadow-sm active:scale-95"
          onClick={() => addSavedLocation(currentCity)}
          title="Save this location to favorites"
          aria-label="Save current location"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400 sm:w-3.5 sm:h-3.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>Save City</span>
        </button>
      </div>

      {/* 6. Contextual Meteorological Intelligence Briefing Card */}
      <div
        className="w-full max-w-2xl p-3.5 sm:p-5 mx-auto flex items-start gap-3 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent border border-sky-400/30 backdrop-blur-xl shadow-glass text-left transition-all"
        role="region"
        aria-label="Meteorological summary"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center flex-shrink-0 text-sky-400 shadow-sm mt-0.5">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" className="sm:w-5 sm:h-5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-sky-400 truncate">
              Atmospheric Briefing
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-sky-400/15 text-sky-300 border border-sky-400/20 flex-shrink-0">
              Deterministic Outlook
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-white/95">
            {intelligenceSummary}
          </p>
        </div>
      </div>
    </section>
  );
};
