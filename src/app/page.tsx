'use client';

import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { AtmosphereCanvas } from '../components/weather/AtmosphereCanvas';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { ToastContainer } from '../components/layout/Toast';
import { HeroSection } from '../components/weather/HeroSection';
import { HourlyTimeline } from '../components/weather/HourlyTimeline';
import { WeatherChart } from '../components/weather/WeatherChart';
import { DailyForecast } from '../components/weather/DailyForecast';
import { BentoGrid } from '../components/weather/BentoGrid';
import { SkeletonView } from '../components/ui/SkeletonView';
import { SearchModal } from '../components/modals/SearchModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { ComparisonModal } from '../components/modals/ComparisonModal';

/**
 * HomePage Component (Root Weather Application View)
 *
 * Assembles the full meteorological intelligence interface:
 * 1. Background Atmosphere Shader Canvas (WebGL particle dynamics & ambient lighting).
 * 2. Navigation Header (Location branding, search modal trigger, quick actions).
 * 3. Hero Section (Current temperature, condition status, high/low, natural language briefing).
 * 4. 24-Hour Hourly Timeline (Horizontal snap-scroll forecast cards & interactive hour inspector).
 * 5. Interactive Weather Trend Dynamics Chart (Multi-metric spline canvas: Temp, Rain, Wind, Humidity, UV).
 * 6. 10-Day Extended Forecast (Weekly temperature span range bars & precip probabilities).
 * 7. Bento Grid Diagnostics (Wind compass, UV gauge, AQI, Solar arc, Comfort score, Rain radar).
 * 8. Mobile Navigation Bar (Safe-area padded sticky bottom navigation).
 * 9. Modals (Global Search, Settings Preferences, City Differential Comparison).
 * 10. System Toasts (Floating user feedback notifications).
 *
 * Mobile Optimization:
 * - Fluid padding (`px-2.5 xs:px-3 sm:px-6 lg:px-8`),
 * - Responsive vertical spacing between cards (`space-y-4 sm:space-y-6`),
 * - Mobile bottom padding (`pb-24 lg:pb-12`) ensuring content is never obscured by the mobile navigation bar.
 *
 * @component
 * @returns {React.ReactElement} The complete Aura Weather application page.
 */
export default function HomePage() {
  const { isLoading, weatherData } = useWeather();

  return (
    <>
      {/* Dynamic Atmosphere Canvas & Lighting Layers */}
      <AtmosphereCanvas />

      {/* Application Shell */}
      <div className="relative z-10 max-w-6xl mx-auto px-2.5 xs:px-3 sm:px-6 lg:px-8 w-full min-h-screen pb-24 lg:pb-12">
        {/* Header Navigation */}
        <Header />

        {/* Main Content Flow */}
        {isLoading && !weatherData ? (
          <SkeletonView />
        ) : (
          <main id="weather-main-content" role="main" className="space-y-4 sm:space-y-6">
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. 24-Hour Horizon Timeline */}
            <HourlyTimeline />

            {/* 3. Interactive Weather Trend Dynamics Chart */}
            <WeatherChart />

            {/* 4. 10-Day Extended Forecast */}
            <DailyForecast />

            {/* 5. Bento Grid Atmospheric Diagnostics */}
            <BentoGrid />
          </main>
        )}

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>

      {/* Modals & Overlays */}
      <SearchModal />
      <SettingsModal />
      <ComparisonModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}
