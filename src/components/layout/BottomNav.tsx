'use client';

import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ==============================================================================
 * BOTTOM NAVIGATION BAR COMPONENT (Mobile Native iOS/Android Shell)
 * ==============================================================================
 * Displayed exclusively on viewports < 1024px (hidden on desktop).
 * Provides one-tap navigation to:
 * - Current Weather (smooth scrolls to page top)
 * - 10-Day Forecast (smooth scrolls to forecast accordion)
 * - Global Search Modal
 * - Preferences / Settings Modal
 *
 * Implements hardware safe-area-inset padding for edge-to-edge mobile devices.
 */
export const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weather' | 'forecast' | 'search' | 'settings'>('weather');
  const { setSearchOpen, setSettingsOpen } = useWeather();

  /**
   * Dispatches navigation or modal actions based on selected bottom tab
   */
  const handleNav = (tab: 'weather' | 'forecast' | 'search' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'weather') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'forecast') {
      document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'search') {
      setSearchOpen(true);
    } else if (tab === 'settings') {
      setSettingsOpen(true);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/85 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 sm:px-4 pb-[env(safe-area-inset-bottom,0)] z-40 lg:hidden shadow-2xl transition-all"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {/* 1. Real-time Weather Tab */}
      <button
        className={`flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-[11px] font-bold py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
          activeTab === 'weather' ? 'text-sky-400 font-extrabold scale-105' : 'text-white/45 hover:text-white'
        }`}
        onClick={() => handleNav('weather')}
        aria-label="Go to current weather"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
        <span>Weather</span>
      </button>

      {/* 2. 10-Day Forecast Tab */}
      <button
        className={`flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-[11px] font-bold py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
          activeTab === 'forecast' ? 'text-sky-400 font-extrabold scale-105' : 'text-white/45 hover:text-white'
        }`}
        onClick={() => handleNav('forecast')}
        aria-label="Scroll to 10-day forecast"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Forecast</span>
      </button>

      {/* 3. Search City Tab */}
      <button
        className={`flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-[11px] font-bold py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
          activeTab === 'search' ? 'text-sky-400 font-extrabold scale-105' : 'text-white/45 hover:text-white'
        }`}
        onClick={() => handleNav('search')}
        aria-label="Open location search"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Search</span>
      </button>

      {/* 4. Settings Tab */}
      <button
        className={`flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-[11px] font-bold py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
          activeTab === 'settings' ? 'text-sky-400 font-extrabold scale-105' : 'text-white/45 hover:text-white'
        }`}
        onClick={() => handleNav('settings')}
        aria-label="Open application preferences"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Settings</span>
      </button>
    </nav>
  );
};
