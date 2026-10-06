'use client';

import React from 'react';

interface WeatherIconProps {
  type: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ type, className = '', size = 24 }) => {
  switch (type) {
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-sun ${className}`}>
          <circle cx="12" cy="12" r="4" fill="#facc15" stroke="#f59e0b" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#fbbf24" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-moon ${className}`}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="#e0e7ff" stroke="#818cf8" />
        </svg>
      );
    case 'cloud-sun':
    case 'sun-cloud':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-cloud-sun ${className}`}>
          <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.95 8.05a4 4 0 0 0-5.9 0" stroke="#fbbf24" />
          <path d="M17.5 19H9a5 5 0 1 1 2.36-9.4A5 5 0 0 1 21 15a4 4 0 0 1-3.5 4Z" fill="#94a3b8" stroke="#cbd5e1" />
        </svg>
      );
    case 'cloud-moon':
    case 'moon-cloud':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-cloud-moon ${className}`}>
          <path d="M13 3a4 4 0 0 0 6 6 6 6 0 0 1-6-6Z" fill="#e0e7ff" stroke="#818cf8" />
          <path d="M17.5 19H9a5 5 0 1 1 2.36-9.4A5 5 0 0 1 21 15a4 4 0 0 1-3.5 4Z" fill="#475569" stroke="#94a3b8" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-cloud ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#64748b" stroke="#cbd5e1" />
        </svg>
      );
    case 'drizzle':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-drizzle ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#475569" stroke="#94a3b8" />
          <path d="M8 19v2M12 19v2M16 19v2" stroke="#38bdf8" />
        </svg>
      );
    case 'rain':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-rain ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#334155" stroke="#94a3b8" />
          <path d="M8 19l-2 3M12 19l-2 3M16 19l-2 3" stroke="#38bdf8" />
        </svg>
      );
    case 'rain-heavy':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-rain-heavy ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#1e293b" stroke="#64748b" />
          <path d="M8 18l-3 5M12 18l-3 5M16 18l-3 5M20 18l-3 5" stroke="#60a5fa" strokeWidth="2.5" />
        </svg>
      );
    case 'thunder':
    case 'thunderstorm':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-thunder ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#1e1b4b" stroke="#818cf8" />
          <path d="M13 10l-4 6h5l-2 5" stroke="#facc15" strokeWidth="2.5" fill="#facc15" />
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-snow ${className}`}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#334155" stroke="#cbd5e1" />
          <path d="M8 19v1M8 21v1M12 19v1M12 21v1M16 19v1M16 21v1" stroke="#bae6fd" strokeWidth="2" />
        </svg>
      );
    case 'fog':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-fog ${className}`}>
          <path d="M4 14h16M2 17h20M6 20h12" stroke="#94a3b8" strokeWidth="2.5" />
          <path d="M17.5 12H9a5 5 0 1 1 2.36-9.4A5 5 0 0 1 21 8a4 4 0 0 1-3.5 4Z" fill="#475569" stroke="#cbd5e1" />
        </svg>
      );
    case 'wind':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg icon-wind ${className}`}>
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" stroke="#38bdf8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`weather-icon-svg ${className}`}>
          <circle cx="12" cy="12" r="4" fill="#facc15" stroke="#f59e0b" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" stroke="#fbbf24" />
        </svg>
      );
  }
};
