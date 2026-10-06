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

export const BentoGrid: React.FC = () => {
  return (
    <section className="mb-6" aria-label="Detailed environmental conditions">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span>Atmospheric Diagnostics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <WindCompass />
        <UVGauge />
        <AQIGauge />
        <SolarArc />
        <ComfortIndex />
        <PrecipTimeline />
        <WeatherStatCards />
        <StoryProgression />
      </div>
    </section>
  );
};
