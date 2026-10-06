'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ==============================================================================
 * AIR QUALITY INDEX (AQI) MODULE
 * ==============================================================================
 * Displays the current US EPA Air Quality Index standard with:
 * - Color-coded health classification pill (Good -> Very Unhealthy)
 * - Fine particulate concentrations (PM2.5, PM10)
 * - Gas concentrations (NO₂, O₃)
 * - Specific health activity advisory
 */
export const AQIGauge: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const { aqi } = weatherData;

  // Determine badge styling based on risk category
  let pillClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (aqi.statusClass === 'moderate') {
    pillClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (aqi.statusClass === 'unhealthy-sensitive' || aqi.statusClass === 'unhealthy') {
    pillClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  } else if (aqi.statusClass === 'very-unhealthy') {
    pillClasses = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  }

  return (
    <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-emerald-400">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
          <span>Air Quality</span>
        </span>
        <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full border ${pillClasses}`}>
          {aqi.status}
        </span>
      </div>

      {/* Main AQI Score */}
      <div className="flex items-baseline gap-2 my-1">
        <span className="font-display text-2xl sm:text-3xl font-black text-white">{aqi.aqi}</span>
        <span className="text-[11px] sm:text-xs font-medium text-white/40">US AQI Standard</span>
      </div>

      {/* Health Advisory Text */}
      <p className="text-[11px] sm:text-xs font-medium text-white/60 leading-relaxed mb-2.5 sm:mb-3">
        {aqi.advice}
      </p>

      {/* Pollutant Breakdown Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-2 sm:pt-2.5 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">PM2.5</span>
          <span className="text-xs sm:text-sm font-black text-white">{aqi.pm2_5} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">PM10</span>
          <span className="text-xs sm:text-sm font-black text-white">{aqi.pm10} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">NO₂</span>
          <span className="text-xs sm:text-sm font-black text-white">{aqi.no2} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">O₃</span>
          <span className="text-xs sm:text-sm font-black text-white">{aqi.o3} µg</span>
        </div>
      </div>
    </div>
  );
};
