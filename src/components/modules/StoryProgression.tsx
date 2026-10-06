'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { formatTemperature } from '../../utils/meteorology';

/**
 * StoryProgression Component
 *
 * Breaks down the daily meteorological trajectory into 4 distinct chronological chapters:
 * Morning (08:00), Afternoon (13:00 peak heat), Evening (18:00 cooling), and Night (22:00 low).
 *
 * Provides users with a conversational, humanized narrative of how conditions
 * will evolve across the diurnal solar cycle.
 *
 * @component
 * @returns {React.ReactElement | null} The 4-quadrant diurnal story card or null if data is absent.
 */
export const StoryProgression: React.FC = () => {
  const { weatherData, settings } = useWeather();
  if (!weatherData) return null;

  const { story } = weatherData;
  const tempUnit = settings.tempUnit;

  // Extract the 4 sequential diurnal quarters
  const slots = [
    { key: 'morning', ...story.morning },
    { key: 'afternoon', ...story.afternoon },
    { key: 'evening', ...story.evening },
    { key: 'night', ...story.night }
  ];

  return (
    <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between min-h-[190px] sm:col-span-2 lg:col-span-2">
      {/* Header section with book/chronology icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="text-sky-400"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Diurnal Progression</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          Chronological Summary
        </span>
      </div>

      {/* 4-Column / 2-Column Responsive Progression Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 my-1">
        {slots.map(s => (
          <div
            key={s.key}
            className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1 hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
              {s.timeLabel}
            </span>
            <span className="font-display text-base sm:text-lg font-extrabold text-white">
              {formatTemperature(s.temp, tempUnit)}°
            </span>
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-tight mt-0.5 line-clamp-2">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

