'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, settings, updateSettings } = useWeather();

  if (!isSettingsOpen) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/75 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSettingsOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Application Settings"
    >
      <div className="w-full max-w-lg bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-6 mt-8 sm:mt-16 flex flex-col gap-5 animate-slide-up backdrop-blur-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-white">Meteorological Preferences</h2>
          <button
            className="glass-btn w-8 h-8 text-white/60 hover:text-white"
            onClick={() => setSettingsOpen(false)}
            aria-label="Close settings"
          >
            &times;
          </button>
        </div>

        {/* Temperature Unit */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Temperature Scale</span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-xs sm:text-sm font-bold text-white">Degrees</span>
            <div className="inline-flex bg-black/40 p-1 rounded-full border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.tempUnit === 'C' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ tempUnit: 'C' })}
              >
                Celsius (°C)
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.tempUnit === 'F' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ tempUnit: 'F' })}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>
        </div>

        {/* Wind Unit */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Wind Velocity Units</span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-xs sm:text-sm font-bold text-white">Velocity</span>
            <div className="inline-flex bg-black/40 p-1 rounded-full border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.windUnit === 'km/h' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ windUnit: 'km/h' })}
              >
                km/h
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.windUnit === 'mph' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ windUnit: 'mph' })}
              >
                mph
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.windUnit === 'knots' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ windUnit: 'knots' })}
              >
                knots
              </button>
            </div>
          </div>
        </div>

        {/* Time Format */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Astronomical Clock</span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-xs sm:text-sm font-bold text-white">Time Notation</span>
            <div className="inline-flex bg-black/40 p-1 rounded-full border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.timeFormat === '12h' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ timeFormat: '12h' })}
              >
                12-Hour (AM/PM)
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.timeFormat === '24h' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ timeFormat: '24h' })}
              >
                24-Hour (Military)
              </button>
            </div>
          </div>
        </div>

        {/* Theme Mode */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Visual Theme</span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-xs sm:text-sm font-bold text-white">Luminance</span>
            <div className="inline-flex bg-black/40 p-1 rounded-full border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.theme === 'system' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ theme: 'system' })}
              >
                Auto
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.theme === 'dark' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ theme: 'dark' })}
              >
                Dark
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.theme === 'light' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ theme: 'light' })}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Atmosphere Canvas Simulation */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">Dynamic Weather Graphics</span>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-xs sm:text-sm font-bold text-white">Atmosphere</span>
            <div className="inline-flex bg-black/40 p-1 rounded-full border border-white/10">
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.atmosphere === 'full' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ atmosphere: 'full' })}
              >
                Ultra 60FPS
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.atmosphere === 'reduced' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ atmosphere: 'reduced' })}
              >
                Eco
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${settings.atmosphere === 'off' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
                onClick={() => updateSettings({ atmosphere: 'off' })}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
