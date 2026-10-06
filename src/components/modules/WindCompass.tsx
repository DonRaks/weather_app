'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { formatWindSpeed, getCardinalDirection } from '../../utils/meteorology';

export const WindCompass: React.FC = () => {
  const { weatherData, settings } = useWeather();
  if (!weatherData) return null;

  const { current } = weatherData;
  const windUnit = settings.windUnit;
  const speed = formatWindSpeed(current.windSpeed, windUnit);
  const gusts = formatWindSpeed(current.windGusts, windUnit);
  const cardinal = getCardinalDirection(current.windDirection);

  return (
    <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
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

      <div className="flex items-center justify-between gap-4 my-2">
        {/* Compass Dial */}
        <div className="relative w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-radial from-sky-400/10 to-transparent flex-shrink-0 shadow-inner">
          <span className="absolute top-1 text-[9px] font-black text-amber-400">N</span>
          <span className="absolute right-1.5 text-[9px] font-black text-white/40">E</span>
          <span className="absolute bottom-1 text-[9px] font-black text-white/40">S</span>
          <span className="absolute left-1.5 text-[9px] font-black text-white/40">W</span>
          
          {/* Compass Needle */}
          <div
            className="w-1 h-[68px] absolute top-[14px] origin-center transition-transform duration-700 ease-out pointer-events-none"
            style={{ transform: `rotate(${current.windDirection}deg)` }}
          >
            {/* North Point */}
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[24px] border-b-sky-400 mx-auto" />
            {/* South Point */}
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[20px] border-t-white/40 mx-auto mt-2" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-sky-400 z-10 shadow-sm" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="font-display text-2xl font-black text-white">{speed} {windUnit}</span>
          <span className="text-xs font-bold text-sky-400">Continuous Flow</span>
          <span className="text-xs font-medium text-white/50">Gusts up to {gusts} {windUnit}</span>
        </div>
      </div>

      <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">
        Calculated from 10m surface anemometer telemetry.
      </p>
    </div>
  );
};
