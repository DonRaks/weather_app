'use client';

import React from 'react';

export const SkeletonView: React.FC = () => {
  return (
    <div className="w-full animate-pulse flex flex-col gap-6" aria-hidden="true">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center justify-center pt-4 pb-6">
        <div className="h-8 w-48 bg-white/10 rounded-2xl mb-3" />
        <div className="h-4 w-32 bg-white/10 rounded-full mb-4" />
        <div className="h-28 w-48 bg-white/10 rounded-3xl mb-4" />
        <div className="h-10 w-36 bg-white/10 rounded-full" />
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="h-32 rounded-3xl bg-white/[0.05] border border-white/10 p-4" />

      {/* Chart Skeleton */}
      <div className="h-64 rounded-3xl bg-white/[0.05] border border-white/10 p-5" />

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
        <div className="h-48 rounded-3xl bg-white/[0.05] border border-white/10 sm:col-span-2 lg:col-span-2" />
        <div className="h-48 rounded-3xl bg-white/[0.05] border border-white/10" />
      </div>
    </div>
  );
};
