'use client';

import React from 'react';

/**
 * SkeletonView Component
 *
 * Provides smooth, animated placeholder wireframes during initial data fetching
 * or asynchronous city transitions to avoid layout shifts (Cumulative Layout Shift - CLS = 0).
 *
 * Mirrors the exact geometry and responsive spacing of the live weather interface.
 *
 * @component
 * @returns {React.ReactElement} The loading skeleton placeholder.
 */
export const SkeletonView: React.FC = () => {
  return (
    <div className="w-full animate-pulse flex flex-col gap-4 sm:gap-6" aria-hidden="true">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col items-center justify-center pt-2 sm:pt-4 pb-4 sm:pb-6">
        <div className="h-7 sm:h-8 w-40 sm:w-48 bg-white/10 rounded-2xl mb-2 sm:mb-3" />
        <div className="h-3.5 sm:h-4 w-28 sm:w-32 bg-white/10 rounded-full mb-3 sm:mb-4" />
        <div className="h-20 sm:h-28 w-40 sm:w-48 bg-white/10 rounded-3xl mb-3 sm:mb-4" />
        <div className="h-8 sm:h-10 w-32 sm:w-36 bg-white/10 rounded-full" />
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="h-28 sm:h-32 rounded-3xl bg-white/[0.05] border border-white/10 p-4" />

      {/* Interactive Weather Chart Skeleton */}
      <div className="h-56 sm:h-64 rounded-3xl bg-white/[0.05] border border-white/10 p-4 sm:p-5" />

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10 sm:col-span-2 lg:col-span-2" />
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-44 sm:h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
      </div>
    </div>
  );
};
