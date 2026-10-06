'use client';

import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WeatherData } from '../../types/weather';
import { formatTemperature, formatWindSpeed } from '../../utils/meteorology';
import { WeatherAPI } from '../../services/weatherApi';

/**
 * ComparisonModal Component
 *
 * Provides a side-by-side differential meteorological comparison between any two saved locations.
 * Fetches real-time telemetry for both cities concurrently via `Promise.all` and visualizes:
 * - Temperature variance
 * - Atmospheric condition descriptions
 * - Rain probability differentials
 * - Relative humidity balance
 * - Wind velocity contrast
 * - UV radiation exposure levels
 * - Air Quality Index (AQI) rating & status
 *
 * Mobile Optimization:
 * - Compact selector controls (`text-xs sm:text-sm`),
 * - Touch-friendly padding (`p-3 sm:p-5`),
 * - Responsive comparison meter bars that scale accurately from 320px to wide desktops.
 *
 * @component
 * @returns {React.ReactElement | null} The rendered comparison dialog or null when closed.
 */
export const ComparisonModal: React.FC = () => {
  const { isCompareOpen, setCompareOpen, savedLocations, settings } = useWeather();
  const [indexA, setIndexA] = useState<number>(0);
  const [indexB, setIndexB] = useState<number>(1);
  const [dataA, setDataA] = useState<WeatherData | null>(null);
  const [dataB, setDataB] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cityA = savedLocations[indexA] || savedLocations[0];
  const cityB = savedLocations[indexB] || savedLocations[Math.min(1, savedLocations.length - 1)];

  // Fetch telemetry for both target cities when modal is active
  useEffect(() => {
    if (!isCompareOpen || !cityA || !cityB) return;

    let isMounted = true;
    setIsLoading(true);

    const loadBoth = async () => {
      try {
        const [resA, resB] = await Promise.all([
          WeatherAPI.fetchFullWeather(cityA),
          WeatherAPI.fetchFullWeather(cityB)
        ]);

        if (isMounted) {
          setDataA(resA);
          setDataB(resB);
        }
      } catch (err) {
        console.warn('Failed to fetch comparison data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadBoth();

    return () => {
      isMounted = false;
    };
  }, [isCompareOpen, cityA, cityB]);

  if (!isCompareOpen) return null;

  const tempUnit = settings.tempUnit;
  const windUnit = settings.windUnit;

  // Comparative metric matrix
  const metrics = (dataA && dataB) ? [
    {
      name: 'Temperature',
      valA: `${formatTemperature(dataA.current.temp, tempUnit)}°${tempUnit}`,
      valB: `${formatTemperature(dataB.current.temp, tempUnit)}°${tempUnit}`,
      rawA: dataA.current.temp,
      rawB: dataB.current.temp
    },
    {
      name: 'Condition',
      valA: dataA.current.conditionText,
      valB: dataB.current.conditionText,
      rawA: 50,
      rawB: 50
    },
    {
      name: 'Rain Chance',
      valA: `${dataA.daily[0]?.precipProbability || 0}%`,
      valB: `${dataB.daily[0]?.precipProbability || 0}%`,
      rawA: dataA.daily[0]?.precipProbability || 0,
      rawB: dataB.daily[0]?.precipProbability || 0
    },
    {
      name: 'Humidity',
      valA: `${dataA.current.humidity}%`,
      valB: `${dataB.current.humidity}%`,
      rawA: dataA.current.humidity,
      rawB: dataB.current.humidity
    },
    {
      name: 'Wind Speed',
      valA: `${formatWindSpeed(dataA.current.windSpeed, windUnit)} ${windUnit}`,
      valB: `${formatWindSpeed(dataB.current.windSpeed, windUnit)} ${windUnit}`,
      rawA: dataA.current.windSpeed,
      rawB: dataB.current.windSpeed
    },
    {
      name: 'UV Index',
      valA: `${dataA.current.uvIndex}`,
      valB: `${dataB.current.uvIndex}`,
      rawA: dataA.current.uvIndex,
      rawB: dataB.current.uvIndex
    },
    {
      name: 'Air Quality',
      valA: `${dataA.aqi.aqi} (${dataA.aqi.status})`,
      valB: `${dataB.aqi.aqi} (${dataB.aqi.status})`,
      rawA: dataA.aqi.aqi,
      rawB: dataB.aqi.aqi
    }
  ] : [];

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/75 backdrop-blur-md z-50 flex items-start justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCompareOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="City Weather Comparison"
    >
      <div className="w-full max-w-xl bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-6 mt-4 sm:mt-16 flex flex-col gap-4 animate-slide-up backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-base sm:text-xl font-black text-white">Comparative Differential Analysis</h2>
          <button
            className="glass-btn w-8 h-8 text-white/60 hover:text-white"
            onClick={() => setCompareOpen(false)}
            aria-label="Close comparison"
          >
            &times;
          </button>
        </div>

        {/* City Selectors */}
        <div className="grid grid-cols-[1fr_36px_1fr] sm:grid-cols-[1fr_40px_1fr] items-center gap-2 my-1 sm:my-2">
          <select
            className="w-full p-2 sm:p-3 rounded-2xl bg-black/40 border border-white/15 text-white font-bold text-xs sm:text-sm outline-none cursor-pointer focus:border-sky-400 truncate"
            value={indexA}
            onChange={(e) => setIndexA(parseInt(e.target.value, 10))}
            aria-label="First location to compare"
          >
            {savedLocations.map((loc, idx) => (
              <option key={idx} value={idx} className="bg-slate-900 text-white">
                {loc.name}, {loc.countryCode || loc.country}
              </option>
            ))}
          </select>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 text-[10px] sm:text-xs font-black mx-auto">
            VS
          </div>

          <select
            className="w-full p-2 sm:p-3 rounded-2xl bg-black/40 border border-white/15 text-white font-bold text-xs sm:text-sm outline-none cursor-pointer focus:border-indigo-400 truncate"
            value={indexB}
            onChange={(e) => setIndexB(parseInt(e.target.value, 10))}
            aria-label="Second location to compare"
          >
            {savedLocations.map((loc, idx) => (
              <option key={idx} value={idx} className="bg-slate-900 text-white">
                {loc.name}, {loc.countryCode || loc.country}
              </option>
            ))}
          </select>
        </div>

        {/* Comparative Status / Results */}
        {isLoading ? (
          <div className="py-8 text-center text-xs sm:text-sm font-semibold text-white/50 animate-pulse">
            Comparing atmospheric telemetry for both locations...
          </div>
        ) : (
          <div className="flex flex-col gap-3 my-1">
            {metrics.map((m, idx) => {
              const sum = (Math.abs(m.rawA) + Math.abs(m.rawB)) || 1;
              const pctA = Math.max(15, Math.min(85, (Math.abs(m.rawA) / sum) * 100));
              const pctB = 100 - pctA;

              return (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-sky-400 font-extrabold truncate max-w-[40%]">{m.valA}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40 flex-shrink-0 px-1">
                      {m.name}
                    </span>
                    <span className="text-indigo-400 font-extrabold text-right truncate max-w-[40%]">{m.valB}</span>
                  </div>
                  <div className="flex h-2 rounded-full bg-white/10 overflow-hidden gap-0.5">
                    <div className="bg-sky-400 h-full rounded-l-full transition-all duration-300" style={{ width: `${pctA}%` }} />
                    <div className="bg-indigo-400 h-full rounded-r-full transition-all duration-300" style={{ width: `${pctB}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
