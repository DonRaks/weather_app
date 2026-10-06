'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { formatTemperature } from '../../utils/meteorology';

export const WeatherStatCards: React.FC = () => {
  const { weatherData, settings } = useWeather();
  if (!weatherData) return null;

  const { current } = weatherData;
  const tempUnit = settings.tempUnit;

  const feelsLike = formatTemperature(current.feelsLike, tempUnit);
  const dewPoint = formatTemperature(current.dewPoint, tempUnit);

  let feelsFooter = `Similar to the actual temperature of ${formatTemperature(current.temp, tempUnit)}°.`;
  if (current.humidity > 65) {
    feelsFooter = `Humidity of ${current.humidity}% is making it feel noticeably warmer.`;
  } else if (current.windSpeed > 25) {
    feelsFooter = `Surface wind is generating a pronounced cooling breeze.`;
  }

  return (
    <>
      {/* Feels Like */}
      <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            <span>Apparent Temp</span>
          </span>
        </div>
        <div className="font-display text-3xl font-black text-white">{feelsLike}°{tempUnit}</div>
        <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">{feelsFooter}</p>
      </div>

      {/* Relative Humidity & Dew Point */}
      <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span>Relative Humidity</span>
          </span>
        </div>
        <div className="font-display text-3xl font-black text-white">{current.humidity}%</div>
        <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">The dew point is {dewPoint}° right now.</p>
      </div>

      {/* Barometric Pressure */}
      <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-indigo-400">
              <circle cx="12" cy="12" r="10" />
              <path d="m14 14-2-4" />
            </svg>
            <span>Barometric Pressure</span>
          </span>
        </div>
        <div className="font-display text-3xl font-black text-white">{current.pressure} <span className="text-sm font-semibold text-white/40">hPa</span></div>
        <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">Atmospheric pressure is currently {current.pressureTrend.toLowerCase()}.</p>
      </div>

      {/* Atmospheric Visibility */}
      <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-cyan-400">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Optical Visibility</span>
          </span>
        </div>
        <div className="font-display text-3xl font-black text-white">{current.visibility} <span className="text-sm font-semibold text-white/40">km</span></div>
        <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">
          {current.visibility >= 10 ? 'Exceptional optical clarity.' : 'Reduced visibility due to atmospheric particulates.'}
        </p>
      </div>

      {/* Cloud Cover */}
      <div className="glass-panel p-5 flex flex-col justify-between min-h-[190px]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/50">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
            <span>Cloud Fraction</span>
          </span>
        </div>
        <div className="font-display text-3xl font-black text-white">{current.cloudCover}%</div>
        <p className="text-xs font-medium text-white/60 leading-relaxed mt-auto pt-2">{current.cloudCover}% of the sky dome is obstructed by clouds.</p>
      </div>
    </>
  );
};
