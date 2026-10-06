'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const AQIGauge: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const { aqi } = weatherData;

  let pillClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (aqi.statusClass === 'moderate') {
    pillClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (aqi.statusClass === 'unhealthy-sensitive' || aqi.statusClass === 'unhealthy') {
    pillClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  } else if (aqi.statusClass === 'very-unhealthy') {
    pillClasses = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  }

  return (
    <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-emerald-400">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
          <span>Air Quality Index</span>
        </span>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${pillClasses}`}>
          {aqi.status}
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-1">
        <span className="font-display text-3xl font-black text-white">{aqi.aqi}</span>
        <span className="text-xs font-medium text-white/40">US AQI Standard</span>
      </div>

      <p className="text-xs font-medium text-white/60 leading-relaxed mb-3">
        {aqi.advice}
      </p>

      <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">PM2.5</span>
          <span className="text-xs font-black text-white">{aqi.pm2_5} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">PM10</span>
          <span className="text-xs font-black text-white">{aqi.pm10} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">NO₂</span>
          <span className="text-xs font-black text-white">{aqi.no2} µg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">O₃</span>
          <span className="text-xs font-black text-white">{aqi.o3} µg</span>
        </div>
      </div>
    </div>
  );
};
