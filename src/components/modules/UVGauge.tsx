'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ==============================================================================
 * UV GAUGE MODULE (Solar Radiation & Skin Protection Advisor)
 * ==============================================================================
 * Visualizes the current UV radiation index with a spectrum bar (Low -> Extreme)
 * and outputs deterministic health recommendations based on WHO UV index guidance.
 */
export const UVGauge: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const uv = weatherData.current.uvIndex;
  const percent = Math.max(0, Math.min(100, (uv / 11) * 100));

  let category = 'Low';
  let advice = 'No protection required. Safe to stay outside.';

  if (uv >= 11) {
    category = 'Extreme';
    advice = 'Take all precautions: stay in shade, wear UV sunglasses, SPF 50+ sunscreen.';
  } else if (uv >= 8) {
    category = 'Very High';
    advice = 'Extra protection required. Avoid direct sun between 11 AM and 3 PM.';
  } else if (uv >= 6) {
    category = 'High';
    advice = 'Protection required. Wear SPF 30+ sunscreen, a hat, and seek shade.';
  } else if (uv >= 3) {
    category = 'Moderate';
    advice = 'Moderate risk. Wear sunscreen if spending extended time outside.';
  }

  return (
    <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-amber-400">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>Solar UV Index</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          {category}
        </span>
      </div>

      {/* Numerical Value & Color Spectrum Bar */}
      <div className="flex flex-col my-1">
        <div className="font-display text-2xl sm:text-3xl font-black text-white">{uv}</div>
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-rose-500 to-purple-500 relative my-2.5 sm:my-3">
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-300"
            style={{ left: `${percent}%` }}
          />
        </div>
      </div>

      {/* Health Advisory */}
      <p className="text-[11px] sm:text-xs font-medium text-white/60 leading-relaxed mt-auto pt-1 sm:pt-2">
        {advice}
      </p>
    </div>
  );
};
