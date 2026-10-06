'use client';

import React from 'react';
import { WindCompass } from '../modules/WindCompass';
import { UVGauge } from '../modules/UVGauge';
import { AQIGauge } from '../modules/AQIGauge';
import { SolarArc } from '../modules/SolarArc';
import { ComfortIndex } from '../modules/ComfortIndex';
import { PrecipTimeline } from '../modules/PrecipTimeline';
import { WeatherStatCards } from '../modules/WeatherStatCard';
import { StoryProgression } from '../modules/StoryProgression';

/**
 * BentoGrid Component
 *
 * Implements a modern, responsive Bento Grid layout displaying 8 modular atmospheric diagnostic cards:
 * 1. WindCompass — Vector direction, current velocity & peak gust indicators.
 * 2. UVGauge — Real-time UV intensity spectrum & WHO protection recommendations.
 * 3. AQIGauge — Air Quality Index (US/European standard) & pollutant breakdown.
 * 4. SolarArc — Dynamic solar trajectory Bezier curve, sunrise, sunset & moon phase.
 * 5. ComfortIndex — Multi-factor thermodynamic comfort score (0-100).
 * 6. PrecipTimeline — Next-4-hour precipitation probability horizon.
 * 7. WeatherStatCards — Apparent temp, humidity/dew point, pressure, visibility & cloud cover.
 * 8. StoryProgression — 4-quadrant chronological diurnal narrative.
 *
 * Responsiveness:
 * - Mobile (<640px): Single-column stack (`grid-cols-1`) with fluid full-width cards.
 * - Tablet (640px - 1024px): 2-column grid (`sm:grid-cols-2`).
 * - Desktop (>1024px): 3-column modular bento grid (`lg:grid-cols-3`).
 *
 * @component
 * @returns {React.ReactElement} The rendered Bento Grid section.
 */
export const BentoGrid: React.FC = () => {
  return (
    <section className="mb-6" aria-label="Detailed environmental conditions">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="text-sky-400"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <h2>Atmospheric Diagnostics</h2>
        </div>
      </div>

      {/* Responsive Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Aerodynamic Wind Telemetry */}
        <WindCompass />

        {/* Ultraviolet Radiation Spectrum */}
        <UVGauge />

        {/* Air Quality & Particulate Diagnostics */}
        <AQIGauge />

        {/* Astronomical Solar & Lunar Arc */}
        <SolarArc />

        {/* Human Biometeorology Comfort Index */}
        <ComfortIndex />

        {/* Precipitation Horizon (Next 4 Hours) */}
        <PrecipTimeline />

        {/* Atmospheric Sensor Stat Cards */}
        <WeatherStatCards />

        {/* Diurnal Progression Story */}
        <StoryProgression />
      </div>
    </section>
  );
};

