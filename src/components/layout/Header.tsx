'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ==============================================================================
 * HEADER COMPONENT (Application Top Navigation & Controls)
 * ==============================================================================
 * Renders the brand mark, active location selector pill, and top-level action buttons:
 * - Quick temperature unit toggle (°C / °F)
 * - Multi-city comparative analyzer trigger
 * - Global geospatial search modal trigger
 * - Preferences / Settings modal trigger
 *
 * Optimized for seamless fluid responsiveness from 320px mobile up to 4K displays.
 */
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
    <header
      className="sticky top-0 z-40 h-16 sm:h-[70px] flex items-center justify-between px-2 sm:px-4 mb-3 sm:mb-4 backdrop-blur-xl border-b border-white/[0.06] sm:border-transparent transition-colors"
      role="banner"
    >
      {/* Brand Identity Group */}
      <div className="flex items-center gap-2.5 no-underline text-white flex-shrink-0" aria-label="Aura Weather Home">
        <div className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25 flex-shrink-0">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
            AURA
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest -mt-0.5 hidden xs:inline-block">
            Atmosphere
          </span>
        </div>
      </div>

      {/* Active City Selector Pill (Clickable trigger for Search modal) */}
      <button
        className="glass-btn px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white max-w-[140px] xs:max-w-[180px] sm:max-w-[240px] gap-1.5 sm:gap-2 border-white/10 hover:border-white/20 shadow-sm flex items-center"
        onClick={() => setSearchOpen(true)}
        aria-label="Change location"
        title="Click to search city"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400 flex-shrink-0 sm:w-4 sm:h-4">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="truncate">
          {currentCity.name}
        </span>
        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-sky-400/20 text-sky-400 flex-shrink-0 hidden xs:inline-block">
          {currentCity.countryCode || 'LIVE'}
        </span>
      </button>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Temperature Unit Toggle (°C / °F) */}
        <button
          className="glass-btn px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white gap-0.5 sm:gap-1"
          onClick={toggleTempUnit}
          aria-label="Toggle temperature unit"
          title="Switch temperature unit"
        >
          <span className={isCelsius ? 'text-sky-400 font-extrabold' : 'text-white/40'}>°C</span>
          <span className="text-white/20 font-light">/</span>
          <span className={!isCelsius ? 'text-sky-400 font-extrabold' : 'text-white/40'}>°F</span>
        </button>

        {/* Multi-City Comparison Modal Trigger */}
        <button
          className="glass-btn w-8 h-8 sm:w-10 sm:h-10 text-white/70 hover:text-white"
          onClick={() => setCompareOpen(true)}
          aria-label="Compare saved cities"
          title="Compare two cities"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>

        {/* Search Modal Trigger */}
        <button
          className="glass-btn w-8 h-8 sm:w-10 sm:h-10 text-white/70 hover:text-white"
          onClick={() => setSearchOpen(true)}
          aria-label="Search city"
          title="Search city"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Preferences / Settings Modal Trigger */}
        <button
          className="glass-btn w-8 h-8 sm:w-10 sm:h-10 text-white/70 hover:text-white"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          title="Open settings"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
