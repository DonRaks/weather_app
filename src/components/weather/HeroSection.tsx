'use client';

import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherIcon } from '../ui/WeatherIcon';
import { formatTemperature } from '../../utils/meteorology';

export const HeroSection: React.FC = () => {
  const { weatherData, currentCity, settings, addSavedLocation } = useWeather();
  const [timeStr, setTimeStr] = useState<string>('');

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

  const displayTemp = formatTemperature(current.temp, tempUnit);
  const displayHigh = formatTemperature(current.tempMax, tempUnit);
  const displayLow = formatTemperature(current.tempMin, tempUnit);
  const displayFeels = formatTemperature(current.feelsLike, tempUnit);

  return (
    <section className="flex flex-col items-center text-center pt-2 pb-6 relative mb-6" aria-label="Current weather conditions">
      {/* City Title & Country */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          {location.name}
        </h1>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 uppercase tracking-wider">
          {location.countryCode || location.country}
        </span>
      </div>

      {/* Live Astronomical Clock */}
      <div className="text-xs sm:text-sm font-medium text-white/70 mb-3 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399] animate-pulse-glow" />
        <span>{timeStr || 'Synchronizing astronomical time...'}</span>
      </div>

      {/* Main Temperature Hero */}
      <div className="relative inline-flex items-start justify-center my-2">
        <span className="font-display text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl select-none">
          {displayTemp}
        </span>
        <span className="font-display text-2xl sm:text-4xl font-bold text-sky-400 mt-2 sm:mt-4 ml-1">
          °{tempUnit}
        </span>
      </div>

      {/* Condition Badge */}
      <div className="flex flex-col items-center gap-2 mb-5">
        <div className="glass-btn px-5 py-2 text-base sm:text-lg font-bold text-white shadow-glass gap-2.5">
          <span className="flex-shrink-0 drop-shadow">
            <WeatherIcon type={current.iconType} size={26} />
          </span>
          <span>{current.conditionText}</span>
        </div>
      </div>

      {/* High / Low / Feels Like / Save City Chips */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mb-6 max-w-xl">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>High</span>
          <strong className="text-amber-400 font-bold">{displayHigh}°</strong>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>Low</span>
          <strong className="text-sky-400 font-bold">{displayLow}°</strong>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-md">
          <span>Feels Like</span>
          <strong className="text-white font-bold">{displayFeels}°</strong>
        </div>
        <button
          className="glass-btn px-3.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white gap-1.5 cursor-pointer shadow-sm"
          onClick={() => addSavedLocation(currentCity)}
          title="Save this location to favorites"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>Save City</span>
        </button>
      </div>

      {/* Intelligence Summary Card */}
      <div className="w-full max-w-2xl p-4 sm:p-5 mx-auto flex items-start gap-3.5 rounded-3xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent border border-sky-400/30 backdrop-blur-xl shadow-glass text-left transition-all" role="region" aria-label="Meteorological summary">
        <div className="w-9 h-9 rounded-2xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center flex-shrink-0 text-sky-400 shadow-sm">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400">
              Atmospheric Briefing
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-400/15 text-sky-300 border border-sky-400/20">
              Deterministic Outlook
            </span>
          </div>
          <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-white/95">
            {intelligenceSummary}
          </p>
        </div>
      </div>
    </section>
  );
};
