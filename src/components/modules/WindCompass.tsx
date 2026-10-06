'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { formatWindSpeed, getCardinalDirection } from '../../utils/meteorology';

/**
 * ==============================================================================
 * WIND COMPASS MODULE (Anemometer & Directional Telemetry)
 * ==============================================================================
 * Displays wind speed, cardinal direction (N, NE, E, SE, S, SW, W, NW),
 * and peak gust measurements with a 360° rotating analog compass needle.
 */
export const WindCompass: React.FC = () => {
  const { weatherData, settings } = useWeather();
  if (!weatherData) return null;

  const { current } = weatherData;
  const windUnit = settings.windUnit;
  const speed = formatWindSpeed(current.windSpeed, windUnit);
  const gusts = formatWindSpeed(current.windGusts, windUnit);
  const cardinal = getCardinalDirection(current.windDirection);

  return (
    <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Wind Dynamics</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          {cardinal} ({current.windDirection}°)
        </span>
      </div>

      {/* Compass Dial & Metrics Body */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 my-1 sm:my-2">
        {/* 360-Degree Analog Dial */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-radial from-sky-400/10 to-transparent flex-shrink-0 shadow-inner">
          <span className="absolute top-1 text-[8px] sm:text-[9px] font-black text-amber-400">N</span>
          <span className="absolute right-1 text-[8px] sm:text-[9px] font-black text-white/40">E</span>
          <span className="absolute bottom-1 text-[8px] sm:text-[9px] font-black text-white/40">S</span>
          <span className="absolute left-1 text-[8px] sm:text-[9px] font-black text-white/40">W</span>
          
          {/* Rotating Compass Needle Vector */}
          <div
            className="w-1 h-[58px] sm:h-[68px] absolute top-[11px] sm:top-[14px] origin-center transition-transform duration-700 ease-out pointer-events-none"
            style={{ transform: `rotate(${current.windDirection}deg)` }}
          >
            {/* North Point */}
            <div className="w-0 h-0 border-l-[3.5px] sm:border-l-[4px] border-l-transparent border-r-[3.5px] sm:border-r-[4px] border-r-transparent border-b-[20px] sm:border-b-[24px] border-b-sky-400 mx-auto" />
            {/* South Point */}
            <div className="w-0 h-0 border-l-[2.5px] sm:border-l-[3px] border-l-transparent border-r-[2.5px] sm:border-r-[3px] border-r-transparent border-t-[16px] sm:border-t-[20px] border-t-white/40 mx-auto mt-2" />
          </div>
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white border-2 border-sky-400 z-10 shadow-sm" />
        </div>

        {/* Velocity Telemetry Numbers */}
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-xl sm:text-2xl font-black text-white">{speed} {windUnit}</span>
          <span className="text-xs font-bold text-sky-400">Continuous Flow</span>
          <span className="text-[11px] sm:text-xs font-medium text-white/50">Gusts up to {gusts} {windUnit}</span>
        </div>
      </div>

      {/* Sensor Metadata Caption */}
      <p className="text-[11px] sm:text-xs font-medium text-white/60 leading-relaxed mt-auto pt-1.5 sm:pt-2">
        Calculated from 10m surface anemometer telemetry.
      </p>
    </div>
  );
};
