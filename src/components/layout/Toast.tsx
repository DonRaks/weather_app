'use client';

import React from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * ToastContainer Component
 *
 * Renders non-intrusive floating feedback notifications (success, error, information)
 * with glassmorphic styling, subtle entry animations, and auto-dismissal timers.
 *
 * Mobile Optimization:
 * - Positioned securely above the mobile bottom navigation bar (`bottom-20 sm:bottom-8`),
 * - Constrained fluid width (`w-[92%] max-w-sm`) to prevent horizontal overflow on 320px screens.
 *
 * @component
 * @returns {React.ReactElement | null} The toast notification container or null if no active toasts.
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWeather();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-[92%] max-w-sm"
      aria-live="polite"
      role="region"
      aria-label="System notifications"
    >
      {toasts.map(toast => {
        let borderAndColor = 'border-white/20 text-white bg-slate-900/90';
        if (toast.type === 'error') {
          borderAndColor = 'border-rose-500/40 text-rose-300 bg-rose-950/85';
        } else if (toast.type === 'success') {
          borderAndColor = 'border-emerald-500/40 text-emerald-300 bg-emerald-950/85';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto cursor-pointer flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs font-semibold backdrop-blur-xl border shadow-xl animate-fade-in transition-transform active:scale-95 ${borderAndColor}`}
            onClick={() => removeToast(toast.id)}
            role="alert"
          >
            {/* Error Icon */}
            {toast.type === 'error' && (
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="flex-shrink-0 text-rose-400"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}

            {/* Success Icon */}
            {toast.type === 'success' && (
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="flex-shrink-0 text-emerald-400"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}

            <span className="leading-snug flex-1">{toast.message}</span>

            <span className="text-white/40 hover:text-white text-sm font-bold pl-1" aria-hidden="true">
              &times;
            </span>
          </div>
        );
      })}
    </div>
  );
};
