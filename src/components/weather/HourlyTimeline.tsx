'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherIcon } from '../ui/WeatherIcon';
import { formatTemperature, formatWindSpeed } from '../../utils/meteorology';

/**
 * ==============================================================================
 * HOURLY TIMELINE COMPONENT (24-Hour Horizon & Hour Inspector)
 * ==============================================================================
 * Renders a horizontal, touch-scrollable strip of 24 hourly forecast cards.
 * Features:
 * - Snap-to-card physics for mobile touch swiping
 * - Dynamic condition icon, apparent temperature, rain probability, and wind velocity
 * - Tap an hour to activate deep telemetry inspector panel below the scroll strip
 *
 * Fully responsive and optimized for touch targets on mobile devices.
 */
export const HourlyTimeline: React.FC = () => {
  const { weatherData, settings, selectedHourIndex, setSelectedHourIndex } = useWeather();

  if (!weatherData || !weatherData.hourly.length) return null;

  const { hourly } = weatherData;
  const tempUnit = settings.tempUnit;
  const windUnit = settings.windUnit;
  const selectedHour = hourly[selectedHourIndex] || hourly[0];

  return (
    <section className="mb-4 sm:mb-6" aria-label="Hourly forecast">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>24-Hour Horizon</span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-semibold text-white/40">Tap hour to inspect</span>
      </div>

      {/* Glassmorphic Container */}
      <div className="glass-panel p-2 sm:p-2.5">
        {/* Horizontal Snap Scroll Container */}
        <div
          className="flex gap-2 overflow-x-auto overflow-y-hidden py-2 px-1 snap-x snap-mandatory scrollbar-thin overscroll-x-contain"
          role="list"
          tabIndex={0}
          aria-label="24-Hour hourly forecast list"
        >
          {hourly.map((hour, idx) => {
            const isSelected = idx === selectedHourIndex;
            const displayTemp = formatTemperature(hour.temp, tempUnit);
            const displayWind = formatWindSpeed(hour.windSpeed, windUnit);

            return (
              <button
                key={idx}
                type="button"
                className={`flex-none w-[70px] sm:w-[84px] snap-start flex flex-col items-center py-2.5 sm:py-3 px-1 rounded-2xl border transition-all duration-150 text-center cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-400/25 to-indigo-500/15 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.3)] -translate-y-0.5 scale-105'
                    : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.18]'
                }`}
                onClick={() => setSelectedHourIndex(idx)}
                role="listitem"
                aria-selected={isSelected}
              >
                {/* Time Stamp */}
                <div className={`text-[11px] sm:text-xs font-bold mb-1 ${isSelected ? 'text-sky-400 font-black' : 'text-white/70'}`}>
                  {hour.formattedTime}
                </div>

                {/* Condition Icon */}
                <div className="my-1 flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7">
                  <WeatherIcon type={hour.iconType} size={20} />
                </div>

                {/* Temperature */}
                <div className="font-display text-sm font-black text-white mt-0.5">
                  {displayTemp}°
                </div>

                {/* Rain Probability Pill */}
                <div className="text-[9px] sm:text-[10px] font-extrabold text-sky-300 mt-1 min-h-[14px]">
                  {hour.precipitationProbability > 0 ? (
                    <span>💧{hour.precipitationProbability}%</span>
                  ) : null}
                </div>

                {/* Wind Velocity */}
                <div className="text-[9px] font-semibold text-white/35 mt-0.5 truncate max-w-full">
                  {displayWind} {windUnit}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hour Details Inspector Panel */}
        {selectedHour && (
          <div className="mt-2 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2 px-2.5 sm:px-3 py-2 animate-fade-in bg-white/[0.02] rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Timestamp</span>
              <span className="text-xs sm:text-sm font-black text-white truncate">
                {selectedHour.formattedTime === 'Now' ? 'Current Condition' : selectedHour.formattedTime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Apparent Temp</span>
              <span className="text-xs sm:text-sm font-black text-sky-400">
                {formatTemperature(selectedHour.feelsLike, tempUnit)}°{tempUnit}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Relative Humidity</span>
              <span className="text-xs sm:text-sm font-black text-white">
                {selectedHour.humidity}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Peak Gusts</span>
              <span className="text-xs sm:text-sm font-black text-white">
                {formatWindSpeed(selectedHour.windGusts, windUnit)} {windUnit}
              </span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Cloud Density</span>
              <span className="text-xs sm:text-sm font-black text-white">
                {selectedHour.cloudCover}%
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
