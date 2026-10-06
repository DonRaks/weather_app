'use client';

import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherIcon } from '../ui/WeatherIcon';
import { formatTemperature } from '../../utils/meteorology';

/**
 * ==============================================================================
 * DAILY FORECAST COMPONENT (10-Day Extended Range Spectrum & Accordion)
 * ==============================================================================
 * Renders a 10-day meteorological outlook.
 * Key Features:
 * - Normalized Apple Weather style temperature range spectrum bars
 * - Live temperature dot indicator on "Today" row
 * - Expandable accordion drawers revealing deep daily metrics:
 *   Peak wind velocity, UV radiation index, cumulative precipitation sum, daylight hours
 *
 * Highly responsive grid that avoids clipping on narrow 320px mobile displays.
 */
export const DailyForecast: React.FC = () => {
  const { weatherData, settings } = useWeather();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!weatherData || !weatherData.daily.length) return null;

  const { daily } = weatherData;
  const tempUnit = settings.tempUnit;

  /**
   * Toggles accordion expanded drawer
   */
  const toggleDay = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="forecast-section" className="mb-4 sm:mb-6" aria-label="10-Day extended forecast">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>10-Day Extended Outlook</span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-semibold text-white/40">Range Spectrum</span>
      </div>

      <div className="glass-panel p-2 sm:p-4">
        <div className="flex flex-col gap-1">
          {daily.map((day, idx) => {
            const isExpanded = expandedIndex === idx;
            const minT = formatTemperature(day.tempMin, tempUnit);
            const maxT = formatTemperature(day.tempMax, tempUnit);

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-colors duration-150 overflow-hidden border ${
                  isExpanded ? 'bg-white/[0.06] border-white/15' : 'border-transparent hover:bg-white/[0.04]'
                }`}
              >
                {/* Accordion Summary Row */}
                <button
                  className="w-full grid grid-cols-[52px_28px_1fr_95px_14px] xs:grid-cols-[65px_32px_1fr_115px_18px] sm:grid-cols-[90px_42px_1fr_160px_24px] items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 text-left cursor-pointer"
                  onClick={() => toggleDay(idx)}
                  aria-expanded={isExpanded}
                  aria-label={`${day.dayName} weather forecast`}
                >
                  {/* Day Name */}
                  <span className={`text-[11px] xs:text-xs sm:text-sm font-bold truncate ${day.isToday ? 'text-sky-400 font-black' : 'text-white'}`}>
                    {day.dayName}
                  </span>

                  {/* Icon */}
                  <div className="flex items-center justify-center">
                    <WeatherIcon type={day.iconType} size={20} />
                  </div>

                  {/* Condition Text & Rain Badge */}
                  <div className="text-[11px] sm:text-xs font-medium text-white/70 truncate flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <span className="truncate">{day.conditionText}</span>
                    {day.precipProbability >= 20 && (
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-sky-300 bg-sky-500/20 px-1 sm:px-1.5 py-0.2 rounded-full flex-shrink-0">
                        💧{day.precipProbability}%
                      </span>
                    )}
                  </div>

                  {/* Apple Weather Style Range Spectrum Bar */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-display text-[11px] sm:text-xs font-semibold text-white/40 w-5 sm:w-7 text-right flex-shrink-0">
                      {minT}°
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden xs:overflow-visible">
                      <div
                        className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-amber-500"
                        style={{ left: `${day.rangeBar.left}%`, width: `${day.rangeBar.width}%` }}
                      />
                      {day.rangeBar.currentPos !== null && (
                        <div
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-sky-400 shadow-sm z-10"
                          style={{ left: `${day.rangeBar.currentPos}%` }}
                        />
                      )}
                    </div>
                    <span className="font-display text-[11px] sm:text-xs font-bold text-white w-5 sm:w-7 text-left flex-shrink-0">
                      {maxT}°
                    </span>
                  </div>

                  {/* Chevron Expand Indicator */}
                  <span className={`text-white/40 transition-transform duration-200 flex items-center justify-center ${isExpanded ? 'rotate-180 text-sky-400' : ''}`}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="sm:w-4 sm:h-4">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {/* Expanded Detailed Daily Drawer Panel */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-3 sm:p-4 bg-white/[0.02] grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 animate-fade-in">
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Peak Wind</span>
                      <span className="text-xs sm:text-sm font-black text-white">{day.windSpeedMax} km/h ({day.windDirection}°)</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">UV Peak</span>
                      <span className="text-xs sm:text-sm font-black text-white">Index {day.uvIndexMax}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Precipitation</span>
                      <span className="text-xs sm:text-sm font-black text-sky-300">{day.precipSum} mm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Daylight Hours</span>
                      <span className="text-xs sm:text-sm font-black text-amber-300">{day.daylightHours}h</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
