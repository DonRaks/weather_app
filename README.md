# 🌌 AURA Weather — Atmospheric Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

**Aura Weather** is a high-performance atmospheric intelligence and meteorology web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas 2D Particle Simulation**. It provides real-time deterministic weather forecasts, 24-hour hourly scrubbing, dynamic interactive trends, 10-day range spectrums, air quality diagnostics, solar/lunar ephemeris tracking, and multi-city comparative analysis wrapped in an ultra-sleek glassmorphic interface.

---

## 📸 Core Features

- ⚡ **Dynamic Atmospheric Particle Engine**: Procedural 60 FPS Canvas particles simulating live weather conditions (sun motes, rain vectors, heavy thunderstorm lightning flashes, snowflakes, and starry nocturnal skies).
- 🎨 **Adaptive Glassmorphic Design System**: Custom Tailwind CSS design tokens that dynamically react to current celestial position (Day / Night / Sunset) and meteorological status (Clear, Storm, Overcast, Rain, Snow, Fog).
- 📈 **Financial-Grade Interactive Curve**: Custom touch-scrubbable Canvas trend graph displaying 24-hour temperature, precipitation probability, and wind velocity dynamics with real-time crosshair inspection.
- 📅 **10-Day Extended Range Spectrum**: Accordion-expandable forecast featuring Apple Weather-style normalized temperature range spectrum bars and current position markers.
- 🧭 **Atmospheric Diagnostics Bento Grid**:
  - **Wind Compass Instrument**: Directional telemetry with cardinal dial needles and peak gust sensors.
  - **UV Radiation Gauge**: Visual index scale with health safety guidance.
  - **Air Quality Index (AQI)**: US AQI standard breakdown with particulate concentrations (PM2.5, PM10, NO₂, O₃).
  - **Solar & Lunar Ephemeris**: Quadratic Bezier solar trajectory arc, sunrise/sunset times, and moon phase disc rendering.
  - **Bio-Comfort Index**: Combined humidity, temperature, and wind-chill comfort ratings.
  - **Diurnal Progression**: Chronological breakdown across morning, afternoon, evening, and night.
- 🔍 **Global Geospatial Search & Geolocation**: High-accuracy instant autocomplete across global municipalities with reverse GPS geolocation support.
- ⚖️ **Comparative Differential Analysis**: Side-by-side comparative diagnostics between multiple saved cities.
- 📱 **Progressive Web App (PWA) & Offline Caching**: Complete offline persistence via localStorage and mobile-first bottom navigation.

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│  ┌─────────────────────────┐  ┌───────────────────────────────────────┐ │
│  │   AtmosphereCanvas.tsx  │  │        Next.js 14 App Shell           │ │
│  │   (HTML5 2D Particles)  │  │  (Hero, Timeline, Chart, Bento Grid)  │ │
│  └────────────▲────────────┘  └──────────────────▲────────────────────┘ │
│               │                                  │                      │
│               └──────────────────┬───────────────┘                      │
│                                  │ Reactive State                       │
├──────────────────────────────────┼──────────────────────────────────────┤
│                             STATE LAYER                                 │
│  ┌───────────────────────────────┴────────────────────────────────────┐ │
│  │                     WeatherContext.tsx                             │ │
│  │      - Current / Comparison Location State                         │ │
│  │      - Unit Toggles (°C / °F, km/h / mph, 12h / 24h)               │ │
│  │      - Saved Favorites & Search History                            │ │
│  │      - localStorage Synchronization & Offline Cache                │ │
│  └───────────────────────────────▲────────────────────────────────────┘ │
│                                  │ Async Actions                        │
├──────────────────────────────────┼──────────────────────────────────────┤
│                         METEOROLOGY & DOMAIN ENGINE                     │
│  ┌───────────────────────────────┴────────────────────────────────────┐ │
│  │                     src/utils/meteorology.ts                       │ │
│  │      - WMO Weather Interpretation Code (WW) Parser                 │ │
│  │      - Apparent Temp (Heat Index & Wind Chill Formulas)            │ │
│  │      - Dew Point, Solar Arc Quadratic Bezier Interpolation         │ │
│  │      - Natural Language Intelligence Generator                     │ │
│  └───────────────────────────────▲────────────────────────────────────┘ │
│                                  │ Normalized Data                      │
├──────────────────────────────────┼──────────────────────────────────────┤
│                           DATA & NETWORK LAYER                          │
│  ┌───────────────────────────────┴────────────────────────────────────┐ │
│  │                     src/services/weatherApi.ts                     │ │
│  │      - Open-Meteo High-Resolution Forecast API                     │ │
│  │      - Open-Meteo Global Air Quality API                           │ │
│  │      - Open-Meteo Geocoding & BigDataCloud Reverse Geocoding       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
weather_app/
├── public/                     # Static assets & PWA manifest
│   ├── clear.png               # Weather condition iconography
│   ├── clouds.png
│   ├── drizzle.png
│   ├── humidity.png
│   ├── mist.png
│   ├── rain.png
│   ├── search.png
│   ├── snow.png
│   ├── wind.png
│   └── manifest.json           # Web App Manifest
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── globals.css         # Tailwind base, utilities & weather gradients
│   │   ├── layout.tsx          # Root HTML layout, metadata & viewport
│   │   └── page.tsx            # Main application shell
│   ├── components/
│   │   ├── layout/             # Application chrome
│   │   │   ├── Header.tsx      # Brand, search pill, unit toggle & triggers
│   │   │   ├── BottomNav.tsx   # Mobile navigation bar
│   │   │   └── Toast.tsx       # Notification toast container
│   │   ├── modals/             # Dialog overlays
│   │   │   ├── SearchModal.tsx     # Global city search & GPS locator
│   │   │   ├── SettingsModal.tsx   # Preferences & unit configurations
│   │   │   └── ComparisonModal.tsx # Multi-city differential analytics
│   │   ├── modules/            # Bento Grid diagnostic widgets
│   │   │   ├── AQIGauge.tsx        # Air quality breakdown & pollutants
│   │   │   ├── ComfortIndex.tsx    # Outdoor comfort score
│   │   │   ├── PrecipTimeline.tsx  # Short-term rain horizon
│   │   │   ├── SolarArc.tsx        # Sun trajectory & moon phase
│   │   │   ├── StoryProgression.tsx# 4-stage diurnal timeline
│   │   │   ├── UVGauge.tsx         # UV radiation level
│   │   │   ├── WeatherStatCard.tsx # Humidity, pressure, visibility, clouds
│   │   │   └── WindCompass.tsx     # Wind vector compass
│   │   ├── ui/                 # Reusable primitive components
│   │   │   ├── SkeletonView.tsx    # Shimmer loading placeholders
│   │   │   └── WeatherIcon.tsx     # Vector SVG condition icons
│   │   └── weather/            # Primary weather view modules
│   │       ├── AtmosphereCanvas.tsx # 2D physics weather particle engine
│   │       ├── BentoGrid.tsx        # Responsive widget grid container
│   │       ├── DailyForecast.tsx    # 10-day forecast accordion
│   │       ├── HeroSection.tsx      # Current temp, city, condition & summary
│   │       ├── HourlyTimeline.tsx   # 24-hour horizontal scrubber
│   │       └── WeatherChart.tsx     # Interactive bezier curve trend graph
│   ├── context/
│   │   └── WeatherContext.tsx  # Centralized React state management
│   ├── services/
│   │   └── weatherApi.ts       # Weather, AQI & geocoding REST clients
│   ├── types/
│   │   └── weather.ts          # Strongly typed domain interfaces
│   └── utils/
│       ├── constants.ts        # App defaults, storage keys & config
│       ├── meteorology.ts      # Meteorology calculations & WMO code mapper
│       └── storage.ts          # Safe localStorage serialization helpers
├── .gitignore                  # Git exclusions (.next, node_modules, env)
├── next.config.mjs             # Next.js build configuration
├── package.json                # Project dependencies and npm scripts
├── postcss.config.mjs          # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts          # Tailwind theme tokens & glassmorphism utilities
├── tsconfig.json               # TypeScript compiler options
└── README.md                   # Project documentation
```

---

## 💡 Engineering Decisions & Rationale

| Architecture Decision | Why It Was Chosen |
| :--- | :--- |
| **Next.js 14 (App Router)** | Provides automatic code-splitting, static page pre-rendering, optimized font loading (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`), and seamless deployment on Vercel with zero configuration. |
| **Tailwind CSS** | Eliminates monolithic CSS debt. Utility-first classes compile into an ultra-lean CSS footprint (~16 kB), enable responsive layout variants (`sm:`, `md:`, `lg:`), and make glassmorphic design modifications rapid and maintainable. |
| **HTML5 Canvas 2D Particle Engine** | Replaced static backgrounds with dynamic 60 FPS procedural particles (rain velocity vectors, snow drift, solar motes, nocturnal star twinkle, and lightning flashes) without the heavy bundle size and GPU battery drain of 3D WebGL libraries. |
| **Open-Meteo REST API** | Selected for its high-accuracy numerical weather prediction (NWP) models (ECMWF, GFS, ICON), comprehensive WMO weather codes, integrated air quality forecasts, and zero API-key requirement for baseline execution. |
| **Native Canvas Scrubber Graph** | Handcrafted cubic Bezier curve rendering with touch-scrubbing crosshairs rather than importing heavy charting libraries (like Chart.js or Recharts). Resulted in 0 additional bundle overhead and sub-millisecond scrubber response time. |
| **Context API + LocalStorage** | Avoided heavy external state managers (Redux/Zustand) for this single-page scope while guaranteeing instant hydration, offline recovery, and persistence across user sessions. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DonRaks/weather_app.git
   cd weather_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

4. **Create a production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ How to Deploy to Vercel

Aura Weather is built on Next.js 14 and is architected for instant, zero-config deployment on Vercel.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import your `DonRaks/weather_app` repository from GitHub.
5. Vercel automatically detects **Next.js**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click **"Deploy"**.
7. Vercel will build and assign a production URL (e.g., `https://aura-weather-app.vercel.app`).

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Authenticate with your Vercel account:
   ```bash
   vercel login
   ```
3. Deploy directly from your local terminal:
   ```bash
   vercel
   ```
4. For production release:
   ```bash
   vercel --prod
   ```

---

## 📊 Performance & Best Practices

- **Core Web Vitals**: Optimized for sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS).
- **Accessibility (a11y)**: Full ARIA roles, semantic landmarks (`<main>`, `<header>`, `<nav>`, `role="dialog"`), keyboard navigation for modals and lists, and high-contrast text ratios.
- **Responsive Layout**: Designed for mobile phones (375px+), tablets, laptops, and ultra-wide displays (4K).

---

## 📄 License

This project is licensed under the **MIT License**.