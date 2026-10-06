import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        aura: {
          dark: '#080c16',
          surface: 'rgba(22, 30, 48, 0.65)',
          surfaceHover: 'rgba(30, 41, 66, 0.8)',
          elevated: 'rgba(26, 36, 58, 0.85)',
          glass: 'rgba(255, 255, 255, 0.07)',
          glassHover: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderFocus: 'rgba(255, 255, 255, 0.28)',
        },
        sky: {
          glow: 'rgba(56, 189, 248, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
        glass: '24px',
        'glass-sm': '12px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-card': '0 8px 24px rgba(0, 0, 0, 0.35)',
        glow: '0 0 30px rgba(56, 189, 248, 0.25)',
        'glow-warm': '0 0 30px rgba(251, 146, 60, 0.25)',
        'glow-sun': '0 0 30px rgba(250, 204, 21, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shimmer': 'shimmer 1.5s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 250ms ease-out forwards',
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
