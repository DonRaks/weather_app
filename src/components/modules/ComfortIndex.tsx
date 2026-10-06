'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const ComfortIndex: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const { comfort } = weatherData;

  return (
    <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-rose-400">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Bio-Comfort Metric</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          {comfort.category}
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-2">
        <span className="font-display text-3xl font-black text-white">{comfort.score}</span>
        <span className="text-xs font-bold text-white/40">/ 100</span>
      </div>

      <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">
        {comfort.description}
      </p>
    </div>
  );
};
