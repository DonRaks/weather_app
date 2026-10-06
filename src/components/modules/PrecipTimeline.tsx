'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const PrecipTimeline: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const { precipTimeline } = weatherData;

  return (
    <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span>Precipitation Horizon</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          Next 4 Hours
        </span>
      </div>

      <div className="flex flex-col gap-2 my-2">
        <div className="grid grid-cols-5 gap-1.5 h-11 items-end">
          {precipTimeline.map((slot, idx) => {
            const heightPct = Math.max(8, slot.prob);
            return (
              <div key={idx} className="bg-sky-500/15 rounded-md h-full flex items-end overflow-hidden p-0.5">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-sky-400 rounded-sm transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                  title={`${slot.prob}% rain probability`}
                />
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-5 text-center text-[10px] font-bold text-white/45">
          {precipTimeline.map((slot, idx) => (
            <span key={idx}>{slot.label}</span>
          ))}
        </div>
      </div>

      <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">
        Probability and intensity model updated every cycle.
      </p>
    </div>
  );
};
