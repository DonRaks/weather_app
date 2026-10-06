'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ==============================================================================
 * SOLAR & LUNAR EPHEMERIS MODULE
 * ==============================================================================
 * Visualizes the celestial daily cycle:
 * 1. Sun Trajectory Arc: Computes real-time 2D position along a quadratic Bezier curve
 *    P(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2 based on elapsed daylight fraction.
 * 2. Sunrise, Solar Noon (Zenith), and Sunset timestamps.
 * 3. Deterministic Julian Day Lunar Phase calculation and shaded illumination disc.
 */
export const SolarArc: React.FC = () => {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const { sunMoon } = weatherData;

  // Position Sun dot along quadratic Bezier arc:
  // Path: M 10,70 Q 150,5 290,70
  const t = Math.max(0, Math.min(1, sunMoon.sunPositionPercent / 100));
  const p0 = { x: 10, y: 70 };
  const p1 = { x: 150, y: 5 };
  const p2 = { x: 290, y: 70 };

  const dotX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const dotY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  // Calculate optical inset shadow representing lunar phase shadow
  const shadowInset = Math.round((100 - sunMoon.moonIllumination) * 0.28);

  return (
    <div className="glass-panel p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[190px] sm:col-span-2 lg:col-span-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white/50">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a7 7 0 1 0 10 10" />
          </svg>
          <span>Solar & Lunar Ephemeris</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          {sunMoon.daylightHours}h Daylight
        </span>
      </div>

      {/* Solar Arc Curve SVG */}
      <div className="w-full h-16 sm:h-20 relative my-1">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" aria-label="Sun trajectory curve">
          {/* Dashed Trajectory Arc */}
          <path
            d="M 10,70 Q 150,5 290,70"
            fill="none"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
          {/* Horizon Reference Baseline */}
          <line
            x1="10"
            y1="70"
            x2="290"
            y2="70"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1.5"
          />
          {/* Sun Position Dot */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6.5"
            fill={sunMoon.isDay ? '#facc15' : '#94a3b8'}
            stroke={sunMoon.isDay ? '#f59e0b' : '#cbd5e1'}
            strokeWidth="2.5"
            className="drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
          />
        </svg>
      </div>

      {/* Sunrise / Solar Noon / Sunset Timestamps */}
      <div className="flex justify-between text-xs font-bold text-white mb-2.5 sm:mb-3">
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Sunrise</span>
          <span className="text-xs sm:text-sm font-black text-amber-300">{sunMoon.sunrise}</span>
        </div>
        <div className="flex flex-col text-center">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Solar Zenith</span>
          <span className="text-xs sm:text-sm font-black text-white">{sunMoon.solarNoon}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Sunset</span>
          <span className="text-xs sm:text-sm font-black text-orange-400">{sunMoon.sunset}</span>
        </div>
      </div>

      {/* Lunar Phase & Illumination Footnote */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-2.5 border-t border-white/10">
        <div
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 flex-shrink-0 shadow-inner"
          style={{ boxShadow: `inset -${shadowInset}px 0 0 0 #334155` }}
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">{sunMoon.moonPhaseName}</span>
          <span className="text-[10px] font-medium text-white/50">{sunMoon.moonIllumination}% Illumination</span>
        </div>
      </div>
    </div>
  );
};
