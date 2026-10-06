'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const Header: React.FC = () => {
  const {
    currentCity,
    settings,
    toggleTempUnit,
    setSearchOpen,
    setSettingsOpen,
    setCompareOpen
  } = useWeather();

  const isCelsius = settings.tempUnit === 'C';

  return (
    <header className="sticky top-0 z-50 h-[70px] flex items-center justify-between px-2 md:px-4 mb-4 backdrop-blur-md transition-colors" role="banner">
      {/* Brand Group */}
      <div className="flex items-center gap-3 no-underline text-white" aria-label="Aura Weather Home">
        <div className="w-[38px] h-[38px] rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
            AURA
          </span>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest -mt-0.5">
            Atmospheric Intelligence
          </span>
        </div>
      </div>

      {/* Location Selector Pill */}
      <button
        className="glass-btn px-4 py-2 text-sm font-semibold text-white/90 hover:text-white max-w-[240px] gap-2 border-white/10 hover:border-white/20 shadow-sm hidden sm:flex items-center"
        onClick={() => setSearchOpen(true)}
        aria-label="Change location"
        title="Click to search city"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400 flex-shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="truncate">
          {currentCity.name}, {currentCity.countryCode || currentCity.country}
        </span>
        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-sky-400/20 text-sky-400 rounded-full">
          Live
        </span>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Quick Unit Toggle Pill */}
        <button
          className="glass-btn px-3.5 py-1.5 text-xs font-bold text-white gap-1"
          onClick={toggleTempUnit}
          aria-label="Toggle temperature unit"
        >
          <span className={isCelsius ? 'text-sky-400' : 'text-white/40'}>°C</span>
          <span className="text-white/20 font-light">/</span>
          <span className={!isCelsius ? 'text-sky-400' : 'text-white/40'}>°F</span>
        </button>

        {/* Compare Cities Button */}
        <button
          className="glass-btn w-10 h-10 text-white/70 hover:text-white"
          onClick={() => setCompareOpen(true)}
          aria-label="Compare saved cities"
          title="Compare two cities"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>

        {/* Search Icon Button */}
        <button
          className="glass-btn w-10 h-10 text-white/70 hover:text-white"
          onClick={() => setSearchOpen(true)}
          aria-label="Search city"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Settings Button */}
        <button
          className="glass-btn w-10 h-10 text-white/70 hover:text-white"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
