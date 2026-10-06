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

export default function HomePage() {
  const { isLoading, weatherData } = useWeather();

  return (
    <>
      {/* Dynamic Atmosphere Canvas & Lighting Layers */}
      <AtmosphereCanvas />

      {/* Application Shell */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-h-screen pb-24 lg:pb-12">
        {/* Header Navigation */}
        <Header />

        {/* Main Content Flow */}
        {isLoading && !weatherData ? (
          <SkeletonView />
        ) : (
          <main id="weather-main-content" role="main" className="space-y-6">
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. 24-Hour Horizon Timeline */}
            <HourlyTimeline />

            {/* 3. Interactive Weather Trend Dynamics Chart */}
            <WeatherChart />

            {/* 4. 10-Day Extended Forecast */}
            <DailyForecast />

            {/* 5. Bento Grid Diagnostics */}
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
