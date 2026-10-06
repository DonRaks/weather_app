# Architecture & Technical Blueprint: Aura Weather

## 1. Project Overview

**Aura Weather** is a high-performance, client-orchestrated atmospheric intelligence and meteorology web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and an **HTML5 Canvas 2D Physics Particle Engine**.

The primary purpose of the application is to provide real-time, deterministic, hyper-local meteorological forecasts and atmospheric diagnostics wrapped in an ultra-sleek, adaptive glassmorphic interface that mirrors real-world celestial and weather states.

### Core Capabilities
- **Real-Time Meteorology**: High-resolution numerical weather prediction (NWP) aggregation via Open-Meteo REST APIs.
- **Dynamic Physics Atmosphere**: GPU-accelerated 60 FPS procedural particle canvas simulating live precipitation, snow drift, solar motes, nocturnal star twinkle, and thunderstorm lightning flashes.
- **Micro-Scrubbing Graph Dynamics**: Custom financial-grade Bezier curve trend canvas supporting sub-millisecond touch/pointer scrubbing across 24-hour horizons.
- **Comparative Differential Analytics**: Side-by-side meteorological variance comparison between multiple saved locations.
- **Offline-First Resilience**: LocalStorage caching and PWA readiness with seamless automatic hydration.

### Technology Stack

- **Framework**: Next.js 14 (App Router, Static & Client Components)
- **Language**: TypeScript 5.6 (Strict typing with zero `any` domain models)
- **Styling**: Tailwind CSS 3.4 + PostCSS + Autoprefixer (Custom glassmorphism & dynamic CSS token system)
- **State Management**: React 18 Context API (`WeatherContext`) + Custom Hooks + `localStorage` Synchronization
- **Database / Cache**: Browser `localStorage` (Client-side key-value cache for settings, history, and weather payloads)
- **APIs**:
  - Open-Meteo High-Resolution Forecast API (ECMWF / GFS / ICON NWP models)
  - Open-Meteo Global Air Quality API
  - Open-Meteo Geocoding Search API
  - BigDataCloud Client Reverse Geocoding API
- **Animation & Visuals**: HTML5 Canvas 2D Context (Particle simulation & Bezier graphs) + CSS3 Keyframes
- **Typography**: Google Fonts CDN (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`)

---

## 2. Project Structure

```text
weather_app/
├── public/                         # Public static assets & PWA configuration
│   ├── clear.png                   # Condition icons for fallback/PWA
│   ├── clouds.png
│   ├── drizzle.png
│   ├── humidity.png
│   ├── mist.png
│   ├── rain.png
│   ├── search.png
│   ├── snow.png
│   ├── wind.png
│   └── manifest.json               # Progressive Web App manifest
├── src/
│   ├── app/                        # Next.js 14 App Router Directory
│   │   ├── globals.css             # Tailwind base/utilities & dynamic weather shaders
│   │   ├── layout.tsx              # Root HTML layout, metadata, fonts & Viewport
│   │   └── page.tsx                # Single-page application root shell & orchestration
│   ├── components/                 # Component tree organized by architectural domain
│   │   ├── layout/                 # Application shell chrome & global overlays
│   │   │   ├── Header.tsx          # Top navigation bar, brand, search trigger, unit toggles
│   │   │   ├── BottomNav.tsx       # Native mobile navigation bar
│   │   │   └── Toast.tsx           # Asynchronous notification toast dispatcher
│   │   ├── modals/                 # Full-screen dialog sheets & workflows
│   │   │   ├── SearchModal.tsx     # Global geocoding search & GPS geolocation
│   │   │   ├── SettingsModal.tsx   # User preferences, units & graphics throttle
│   │   │   └── ComparisonModal.tsx # Multi-city comparative differential analyzer
│   │   ├── modules/                # Bento Grid telemetry widgets
│   │   │   ├── AQIGauge.tsx        # Air Quality Index & particulate pollutant breakdown
│   │   │   ├── ComfortIndex.tsx    # Bio-comfort score & heat index/wind chill
│   │   │   ├── PrecipTimeline.tsx  # 4-hour precipitation probability bar chart
│   │   │   ├── SolarArc.tsx        # Quadratic Bezier sun arc & lunar phase disc
│   │   │   ├── StoryProgression.tsx# 4-part diurnal chronological narrative
│   │   │   ├── UVGauge.tsx         # UV radiation index spectrum & health advice
│   │   │   ├── WeatherStatCard.tsx # Humidity, dew point, pressure, visibility, clouds
│   │   │   └── WindCompass.tsx     # Anemometer compass dial & peak gusts
│   │   ├── ui/                     # Shared UI primitives
│   │   │   ├── SkeletonView.tsx    # High-fidelity loading state placeholder
│   │   │   └── WeatherIcon.tsx     # Vector SVG weather condition symbol renderer
│   │   └── weather/                # Core weather visualization engines
│   │       ├── AtmosphereCanvas.tsx# 2D physics particle simulation background
│   │       ├── BentoGrid.tsx       # Responsive diagnostic module container
│   │       ├── DailyForecast.tsx   # 10-day range spectrum accordion
│   │       ├── HeroSection.tsx     # Hero temperature, astronomical clock & briefing
│   │       ├── HourlyTimeline.tsx  # 24-hour horizontal scrubber with inspector
│   │       └── WeatherChart.tsx    # Interactive Bezier trend canvas with crosshairs
│   ├── context/
│   │   └── WeatherContext.tsx      # Centralized reactive state provider & action dispatcher
│   ├── services/
│   │   └── weatherApi.ts           # REST API client & response normalizer
│   ├── types/
│   │   └── weather.ts              # Domain interfaces & TypeScript type definitions
│   └── utils/
│       ├── constants.ts            # Default configurations, storage keys & WMO code map
│       ├── meteorology.ts          # Pure domain math, conversions, astronomical algorithms
│       └── storage.ts              # Safe JSON localStorage wrapper with fallback handling
├── .gitignore                      # Git exclusion rules
├── next.config.mjs                 # Next.js compiler & bundling options
├── package.json                    # Package metadata & dependencies
├── postcss.config.mjs              # PostCSS plugins configuration
├── tailwind.config.ts              # Tailwind design tokens, shadows, keyframes
├── tsconfig.json                   # TypeScript compiler configuration
└── README.md                       # High-level overview & deployment guide
```

### Directory & File Roles

- **`src/app/`**: Root of the Next.js App Router. `layout.tsx` injects global metadata, preconnects Google Fonts, and mounts the `WeatherProvider`. `page.tsx` serves as the single unified presentation orchestrator. `globals.css` injects Tailwind directives and dynamic weather theme CSS variables.
- **`src/components/layout/`**: Manages the persistent viewport chrome across mobile and desktop.
- **`src/components/weather/`**: Primary presentation surfaces for the weather experience (Hero, 24-hour Timeline, Bezier Graph, 10-Day Horizon, Bento Grid, Canvas Simulation).
- **`src/components/modules/`**: Atomic diagnostic cards that populate the Bento Grid.
- **`src/components/modals/`**: Modal sheets managed via central state triggers in `WeatherContext`.
- **`src/components/ui/`**: Pure presentational primitives (SVGs, Skeletons) with zero business logic dependencies.
- **`src/context/`**: React Context state container providing a clean unidirectional data flow and unified API for child components.
- **`src/services/`**: Isolates all external network communication and raw JSON normalization from UI components.
- **`src/utils/`**: Pure, deterministic algorithms (astronomical calculations, WMO code interpretation, unit conversions, and storage safety).
- **`src/types/`**: Strongly typed domain models guaranteeing type safety across all layers.

---

## 3. Component Architecture

### Layout & App Chrome

#### 1. `Header`
* **Location:** `src/components/layout/Header.tsx`
* **Purpose:** Displays brand identity, current active city pill, and top-level action triggers (Unit toggle, Compare modal, Search modal, Settings modal).
* **Type:** Layout Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`
* **Receives:** None (Connects via `useWeather`)
* **Provides:** UI triggers for search, settings, comparison modals, and temperature unit toggle.
* **State:** Reads `currentCity`, `settings.tempUnit`.
* **Side effects:** Dispatches context state mutations (`setSearchOpen`, `setSettingsOpen`, `setCompareOpen`, `toggleTempUnit`).
* **Related feature:** Global Navigation & Controls

#### 2. `BottomNav`
* **Location:** `src/components/layout/BottomNav.tsx`
* **Purpose:** Provides iOS/Android native mobile navigation bar for view switching and modal triggers on viewports `< 1024px`.
* **Type:** Layout Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`
* **Receives:** None
* **Provides:** Smooth scrolling to top (`#weather-main-content`), scrolling to forecast (`#forecast-section`), and modal triggers.
* **State:** Local `activeTab: 'weather' | 'forecast' | 'search' | 'settings'`.
* **Side effects:** Window/DOM smooth scrolling, opening search/settings modals.
* **Related feature:** Mobile Navigation

#### 3. `ToastContainer`
* **Location:** `src/components/layout/Toast.tsx`
* **Purpose:** Renders self-dismissing asynchronous notification toasts (errors, successes, info) at the bottom viewport center.
* **Type:** Layout / Feedback Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`
* **Receives:** None
* **Provides:** Dismissal click handler for individual toasts.
* **State:** Consumes `toasts` list from `WeatherContext`.
* **Side effects:** Auto-dismissal timeout (4000ms) managed in context.
* **Related feature:** Global Feedback & Error Alerting

---

### Core Weather Presentation

#### 4. `AtmosphereCanvas`
* **Location:** `src/components/weather/AtmosphereCanvas.tsx`
* **Purpose:** Procedural HTML5 2D canvas physics simulation rendering rain vectors, snow particles, solar motes, stars, and thunderstorm lightning flashes behind glass panels.
* **Type:** Weather / Physics Engine Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`
* **Receives:** None
* **Provides:** Background visual canvas with fixed position and pointer-events none.
* **State:** Internal `useRef` particle array, requestAnimationFrame handle, and lightning flash state.
* **Side effects:** `requestAnimationFrame` render loop, window resize listener, DPR scaling.
* **Related feature:** Atmospheric Simulation

#### 5. `HeroSection`
* **Location:** `src/components/weather/HeroSection.tsx`
* **Purpose:** Displays prominent current temperature, city name, live seconds-synchronized astronomical clock, condition badge, High/Low/Feels-like chips, and natural-language meteorological briefing card.
* **Type:** Feature Presentation Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`, `src/components/ui/WeatherIcon.tsx`, `src/utils/meteorology.ts`
* **Receives:** None (consumes `weatherData`, `currentCity`, `settings`)
* **Provides:** Bookmark/Save City trigger.
* **State:** Local `timeStr` updated via `setInterval(1000)`.
* **Side effects:** 1-second interval timer for live time.
* **Related feature:** Real-Time Hero Diagnostics

#### 6. `HourlyTimeline`
* **Location:** `src/components/weather/HourlyTimeline.tsx`
* **Purpose:** Horizontal scrollable 24-hour forecast strip with snap-scrolling and interactive drill-down inspector panel for selected hours.
* **Type:** Feature Presentation Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`, `src/components/ui/WeatherIcon.tsx`, `src/utils/meteorology.ts`
* **Receives:** None
* **Provides:** Clickable hour selection to update `selectedHourIndex` in context.
* **State:** Consumes `selectedHourIndex` from context.
* **Side effects:** None.
* **Related feature:** 24-Hour Hourly Timeline

#### 7. `WeatherChart`
* **Location:** `src/components/weather/WeatherChart.tsx`
* **Purpose:** Interactive HTML5 Canvas Bezier curve displaying 24-hour trends for Temperature, Precipitation, or Wind Speed with touch/pointer scrubber crosshairs.
* **Type:** Visualization / Canvas Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`, `src/utils/meteorology.ts`
* **Receives:** None
* **Provides:** Metric tab selector (Temperature / Precipitation / Wind).
* **State:** Local `tooltip: { visible, x, time, val, extra }`, active pointer index ref.
* **Side effects:** Canvas 2D render loop, mousemove / touchmove event listeners.
* **Related feature:** Trend Dynamics & Charting

#### 8. `DailyForecast`
* **Location:** `src/components/weather/DailyForecast.tsx`
* **Purpose:** 10-day extended forecast accordion displaying normalized range spectrum bars (min-to-max temperature gradient) and expandable daily details.
* **Type:** Feature Presentation Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** `src/context/WeatherContext.tsx`, `src/components/ui/WeatherIcon.tsx`, `src/utils/meteorology.ts`
* **Receives:** None
* **Provides:** Accordion collapse/expand toggle per day.
* **State:** Local `expandedIndex: number | null`.
* **Side effects:** None.
* **Related feature:** 10-Day Extended Forecast

#### 9. `BentoGrid`
* **Location:** `src/components/weather/BentoGrid.tsx`
* **Purpose:** Responsive grid wrapper (1 column mobile, 2 columns tablet, 3 columns desktop) assembling all atomic diagnostic modules.
* **Type:** Layout / Container Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** All components in `src/components/modules/`
* **Receives:** None
* **Provides:** Grid layout structure.
* **State:** None.
* **Side effects:** None.
* **Related feature:** Atmospheric Diagnostics

---

### Bento Diagnostic Modules

#### 10. `WindCompass`
* **Location:** `src/components/modules/WindCompass.tsx`
* **Purpose:** Anemometer telemetry widget with rotating 360° cardinal dial needle, continuous speed, direction name, and wind gusts.
* **Type:** Bento Module
* **Depends on:** `WeatherContext`, `meteorology.ts`
* **Related feature:** Wind Telemetry

#### 11. `UVGauge`
* **Location:** `src/components/modules/UVGauge.tsx`
* **Purpose:** UV radiation bar with dynamic pin position, risk tier classification (Low to Extreme), and sun-protection health guidance.
* **Type:** Bento Module
* **Depends on:** `WeatherContext`
* **Related feature:** Solar Radiation

#### 12. `AQIGauge`
* **Location:** `src/components/modules/AQIGauge.tsx`
* **Purpose:** Air Quality Index badge with US AQI standard score, health risk alert, and PM2.5, PM10, NO₂, O₃ pollutant concentrations.
* **Type:** Bento Module
* **Depends on:** `WeatherContext`
* **Related feature:** Air Quality Diagnostics

#### 13. `SolarArc`
* **Location:** `src/components/modules/SolarArc.tsx`
* **Purpose:** Visualizes quadratic Bezier solar trajectory with live sun position, sunrise, solar noon, sunset, total daylight hours, and moon phase illumination disc.
* **Type:** Bento Module (Spans 2 columns on desktop)
* **Depends on:** `WeatherContext`
* **Related feature:** Celestial & Ephemeris

#### 14. `ComfortIndex`
* **Location:** `src/components/modules/ComfortIndex.tsx`
* **Purpose:** Bio-comfort algorithm calculating 0-100 score based on humidity, ambient temperature, wind chill, and UV exposure.
* **Type:** Bento Module
* **Depends on:** `WeatherContext`
* **Related feature:** Human Comfort Telemetry

#### 15. `PrecipTimeline`
* **Location:** `src/components/modules/PrecipTimeline.tsx`
* **Purpose:** 5-bar vertical histogram visualizing hourly rain probability for the next 4 hours.
* **Type:** Bento Module
* **Depends on:** `WeatherContext`
* **Related feature:** Precipitation Horizon

#### 16. `StoryProgression`
* **Location:** `src/components/modules/StoryProgression.tsx`
* **Purpose:** Chronological 4-stage breakdown (Morning, Afternoon, Evening, Night) with temperatures and descriptions.
* **Type:** Bento Module (Spans 2 columns on desktop)
* **Depends on:** `WeatherContext`, `meteorology.ts`
* **Related feature:** Diurnal Narrative

#### 17. `WeatherStatCards`
* **Location:** `src/components/modules/WeatherStatCard.tsx`
* **Purpose:** Renders 5 atomic diagnostic cards: Apparent Temperature, Relative Humidity & Dew Point, Barometric Pressure & Trend, Optical Visibility, and Cloud Fraction.
* **Type:** Bento Module Group
* **Depends on:** `WeatherContext`, `meteorology.ts`
* **Related feature:** Physical Atmospheric Properties

---

### Modals & Dialogs

#### 18. `SearchModal`
* **Location:** `src/components/modals/SearchModal.tsx`
* **Purpose:** Modal sheet for searching global locations via Open-Meteo geocoding, GPS browser reverse geocoding, and managing saved favorites/search history.
* **Type:** Modal Workflow Component
* **Depends on:** `WeatherContext`, `WeatherAPI`
* **State:** Local `query`, `results`, `isSearching`, `selectedIndex`, `isLocating`.
* **Side effects:** Debounced search query (280ms), HTML input autofocus, browser Geolocation API (`navigator.geolocation`).
* **Related feature:** Location Management

#### 19. `SettingsModal`
* **Location:** `src/components/modals/SettingsModal.tsx`
* **Purpose:** Configuration sheet for temperature unit (°C/°F), wind velocity (km/h, mph, knots), time notation (12h/24h), luminance theme (Auto/Dark/Light), and Canvas GPU graphics level (Full/Reduced/Off).
* **Type:** Modal Workflow Component
* **Depends on:** `WeatherContext`
* **State:** Reads and updates `settings` in context.
* **Side effects:** None directly (context handles persistence and DOM theme attributes).
* **Related feature:** User Preferences

#### 20. `ComparisonModal`
* **Location:** `src/components/modals/ComparisonModal.tsx`
* **Purpose:** Side-by-side comparative analysis between two selected saved locations with proportional split bars for metrics.
* **Type:** Modal Workflow Component
* **Depends on:** `WeatherContext`, `WeatherAPI`, `meteorology.ts`
* **State:** Local `indexA`, `indexB`, `dataA`, `dataB`, `isLoading`.
* **Side effects:** Parallel asynchronous fetching of both city payloads when open.
* **Related feature:** Comparative Intelligence

---

### Shared UI Primitives

#### 21. `WeatherIcon`
* **Location:** `src/components/ui/WeatherIcon.tsx`
* **Purpose:** Renders handcrafted vector SVG weather icons mapped to condition categories (`sun`, `moon`, `cloud-sun`, `cloud-moon`, `cloud`, `drizzle`, `rain`, `rain-heavy`, `thunder`, `snow`, `fog`, `wind`).
* **Type:** Pure Presentational UI Component
* **Used by:** `HeroSection`, `HourlyTimeline`, `DailyForecast`, `StoryProgression`, `Header`
* **Depends on:** None
* **Receives:** `type: string`, `className?: string`, `size?: number`
* **Related feature:** Shared Visual Primitives

#### 22. `SkeletonView`
* **Location:** `src/components/ui/SkeletonView.tsx`
* **Purpose:** Pulsing placeholder layout rendered during initial cold-start hydration or network latency.
* **Type:** Pure Presentational UI Component
* **Used by:** `src/app/page.tsx`
* **Depends on:** None
* **Related feature:** Loading & Perceived Performance

---

## 4. Component Relationship Map

```text
RootLayout (src/app/layout.tsx)
└── WeatherProvider (src/context/WeatherContext.tsx)
    └── HomePage (src/app/page.tsx)
        ├── AtmosphereCanvas (src/components/weather/AtmosphereCanvas.tsx)
        ├── Header (src/components/layout/Header.tsx)
        │   └── Location Search Pill / Quick Toggles
        ├── SkeletonView (src/components/ui/SkeletonView.tsx) [Conditional: isLoading]
        ├── main#weather-main-content [Conditional: weatherData available]
        │   ├── HeroSection (src/components/weather/HeroSection.tsx)
        │   │   └── WeatherIcon (src/components/ui/WeatherIcon.tsx)
        │   ├── HourlyTimeline (src/components/weather/HourlyTimeline.tsx)
        │   │   └── WeatherIcon (src/components/ui/WeatherIcon.tsx)
        │   ├── WeatherChart (src/components/weather/WeatherChart.tsx)
        │   │   └── HTML5 Canvas 2D Scrubber
        │   ├── DailyForecast (src/components/weather/DailyForecast.tsx)
        │   │   └── WeatherIcon (src/components/ui/WeatherIcon.tsx)
        │   └── BentoGrid (src/components/weather/BentoGrid.tsx)
        │       ├── WindCompass (src/components/modules/WindCompass.tsx)
        │       ├── UVGauge (src/components/modules/UVGauge.tsx)
        │       ├── AQIGauge (src/components/modules/AQIGauge.tsx)
        │       ├── SolarArc (src/components/modules/SolarArc.tsx)
        │       ├── ComfortIndex (src/components/modules/ComfortIndex.tsx)
        │       ├── PrecipTimeline (src/components/modules/PrecipTimeline.tsx)
        │       ├── WeatherStatCards (src/components/modules/WeatherStatCard.tsx)
        │       └── StoryProgression (src/components/modules/StoryProgression.tsx)
        ├── BottomNav (src/components/layout/BottomNav.tsx)
        ├── SearchModal (src/components/modals/SearchModal.tsx)
        ├── SettingsModal (src/components/modals/SettingsModal.tsx)
        ├── ComparisonModal (src/components/modals/ComparisonModal.tsx)
        └── ToastContainer (src/components/layout/Toast.tsx)
```

---

## 5. Feature-to-Component Mapping

| Feature Domain | Primary Components | Services & Utilities | Types |
| :--- | :--- | :--- | :--- |
| **Atmosphere Simulation** | `AtmosphereCanvas.tsx` | `constants.ts` | `WeatherData['current']` |
| **Current Weather Hero** | `HeroSection.tsx`, `Header.tsx` | `meteorology.ts` | `CurrentWeather`, `Location` |
| **Hourly Forecast** | `HourlyTimeline.tsx` | `meteorology.ts` | `HourlyItem` |
| **Trend Dynamics Graph** | `WeatherChart.tsx` | `meteorology.ts` | `GraphMetric`, `HourlyItem` |
| **10-Day Horizon** | `DailyForecast.tsx` | `meteorology.ts` | `DailyItem`, `RangeBarInfo` |
| **Wind Telemetry** | `WindCompass.tsx` | `meteorology.ts` | `CurrentWeather` |
| **Solar & Lunar Ephemeris**| `SolarArc.tsx` | `meteorology.ts` (`calculateMoonPhase`) | `SunMoonData` |
| **Air Quality (AQI)** | `AQIGauge.tsx` | `meteorology.ts` (`normalizeAqiData`) | `AQIData` |
| **Precipitation Horizon** | `PrecipTimeline.tsx` | `meteorology.ts` (`buildPrecipitationTimeline`) | `PrecipSlot` |
| **Bio-Comfort Rating** | `ComfortIndex.tsx` | `meteorology.ts` (`calculateComfort`) | `ComfortData` |
| **Diurnal Narrative** | `StoryProgression.tsx` | `meteorology.ts` (`buildStory`) | `StoryData` |
| **Geospatial Location** | `SearchModal.tsx`, `Header.tsx`| `weatherApi.ts` (`searchLocations`, `reverseGeocode`) | `Location` |
| **Comparative Analytics** | `ComparisonModal.tsx` | `weatherApi.ts` (`fetchFullWeather`) | `WeatherData`, `Location` |
| **User Preferences** | `SettingsModal.tsx` | `storage.ts`, `constants.ts` | `Settings` |
| **System Notifications** | `Toast.tsx` | `WeatherContext.tsx` | `ToastMessage` |

---

## 6. Dependency Architecture

### 1. Direct Dependencies
- `src/app/page.tsx` directly imports and mounts components from `components/layout/`, `components/weather/`, `components/modals/`, and `components/ui/`.
- `BentoGrid.tsx` directly imports individual module components from `components/modules/`.
- Presentation components import `WeatherIcon.tsx` for SVG icon rendering.

### 2. State Dependencies
- All presentation components depend on `useWeather()` exported by `src/context/WeatherContext.tsx`.
- Components consume reactive properties (`weatherData`, `settings`, `currentCity`, `isLoading`, `toasts`) and invoke dispatchers (`setCurrentCity`, `updateSettings`, `showToast`).

### 3. Data Dependencies
- `WeatherContext.tsx` calls `WeatherAPI.fetchFullWeather(currentCity)` to populate `weatherData`.
- `ComparisonModal.tsx` calls `WeatherAPI.fetchFullWeather(cityB)` to populate comparison datasets.
- `SearchModal.tsx` calls `WeatherAPI.searchLocations(query)` and `WeatherAPI.reverseGeocode(lat, lon)`.

### 4. Infrastructure Dependencies
- **Open-Meteo REST APIs**: Primary data upstream for weather, hourly arrays, daily forecasts, and air quality telemetry.
- **BigDataCloud Reverse Geocode**: Resolves raw browser GPS coordinates to city, administrative division, and country code.
- **HTML5 Canvas 2D Context**: Powers the 60 FPS particle loop in `AtmosphereCanvas` and the interactive curve in `WeatherChart`.
- **Browser Web Storage**: `localStorage` handles offline-first persistence of user settings and cached weather.

---

## 7. Data Flow Architecture

### Primary Weather Ingestion Flow

```
[User Selects City / App Boots]
             │
             ▼
   WeatherContext: setCurrentCity(location)
             │
             ▼
   WeatherAPI.fetchFullWeather(location)
             │
             ├──► [Parallel Fetch 1]: api.open-meteo.com/v1/forecast (10 days, hourly, daily, current)
             └──► [Parallel Fetch 2]: air-quality-api.open-meteo.com/v1/air-quality (PM2.5, PM10, AQI, UV)
             │
             ▼
   WeatherAPI.normalizeWeatherData(rawWeather, rawAqi, location)
             │
             ├──► WMO Code Classifier (Maps weather code -> condition category, label, SVG icon)
             ├──► Meteorology Formulas (Dew Point, Apparent Temp, Pressure Trend)
             ├──► Astronomical Engine (Julian Day Moon Phase, Solar Bezier Percentage)
             ├──► Diurnal Story & Intelligence Summarizer
             └──► Comfort Index Matrix (Heat Index + Humidity + Wind Penalty)
             │
             ▼
   Normalized WeatherData Object returned
             │
             ├──► setWeatherData(normalizedData) in WeatherContext
             ├──► setStoredJSON('aura_cached_weather', normalizedData)
             └──► document.documentElement.setAttribute('data-weather', conditionCategory)
             │
             ▼
   All Subscribed React Components Re-render with Normalized Domain Props
```

### User Interaction & State Update Flow

```
[User clicks °C / °F toggle in Header]
             │
             ▼
   Header dispatches: toggleTempUnit()
             │
             ▼
   WeatherContext invokes: updateSettings({ tempUnit: 'F' })
             │
             ├──► Updates settings state in React
             └──► Synchronizes new settings to localStorage
             │
             ▼
   Dependent Components (HeroSection, HourlyTimeline, DailyForecast, WeatherChart, BentoGrid)
   automatically recalculate display temperatures via pure utility:
   formatTemperature(tempC, 'F')
             │
             ▼
   Immediate, synchronous UI update without network re-fetch
```

---

## 8. State Architecture

State is managed through a **single-source-of-truth Context architecture** in `WeatherContext.tsx`, preventing prop drilling while ensuring instantaneous responsiveness.

```
                         WeatherContext State
┌──────────────────────────────────┬─────────────────────────────────┐
│ State Property                   │ Type / Role                     │
├──────────────────────────────────┼─────────────────────────────────┤
│ currentCity                      │ Location (Active GPS/city)      │
│ weatherData                      │ WeatherData | null (Domain obj) │
│ comparisonCity                   │ Location | null                 │
│ comparisonData                   │ WeatherData | null              │
│ settings                         │ Settings (Units, theme, GPU)    │
│ savedLocations                   │ Location[] (Favorites)          │
│ recentSearches                   │ Location[] (Search history)     │
│ activeGraphMetric                │ 'temp' | 'precip' | 'wind'      │
│ selectedHourIndex                │ number (0-23 timeline index)    │
│ isLoading                        │ boolean                         │
│ error                            │ string | null                   │
│ isSearchOpen                     │ boolean                         │
│ isSettingsOpen                   │ boolean                         │
│ isCompareOpen                    │ boolean                         │
│ toasts                           │ ToastMessage[]                  │
└──────────────────────────────────┴─────────────────────────────────┘
```

### LocalStorage Persistence Keys
- `aura_weather_settings`: Persists temperature unit, wind velocity unit, clock format, luminance theme, GPU particle setting.
- `aura_saved_locations`: Persists bookmarked favorite cities.
- `aura_recent_searches`: Persists the last 8 queried cities.
- `aura_last_location`: Persists the active city across browser sessions.
- `aura_cached_weather`: Persists the full weather payload for instant offline hydration on cold boot.

### DOM Attribute Synchronization
- `data-theme`: Synchronized to `document.documentElement` (`"dark"` or `"light"`).
- `data-weather`: Synchronized to `document.documentElement` based on current condition (`"clear-day"`, `"clear-night"`, `"cloudy-day"`, `"cloudy-night"`, `"rain"`, `"thunderstorm"`, `"snow"`, `"fog"`), triggering dynamic CSS gradient shifts in `globals.css`.

---

## 9. Build & Implementation Order

If constructing this application systematically, the dependency-aware implementation sequence is:

```text
1. Types & Domain Interfaces (src/types/weather.ts)
   └── Foundation for all data contracts, state interfaces, and API responses.

2. Constants & Pure Meteorology Utilities (src/utils/)
   ├── constants.ts (WMO code dictionary, default city coordinates)
   ├── storage.ts (Safe browser storage wrappers)
   └── meteorology.ts (Unit conversions, Julian Day moon phase, comfort index, WMO mapper)

3. API Service & Domain Normalization (src/services/weatherApi.ts)
   └── Network fetchers, Open-Meteo payload parsers, and reverse geocoding client.

4. Central State Management Layer (src/context/WeatherContext.tsx)
   └── Context provider, state reducers, localStorage synchronization, and action handlers.

5. Design System & Styling (tailwind.config.ts & src/app/globals.css)
   └── Atmospheric color palettes, glassmorphism utilities, and dynamic gradient tokens.

6. Shared UI Primitives (src/components/ui/)
   ├── WeatherIcon.tsx (Vector SVG condition icons)
   └── SkeletonView.tsx (Shimmer loading placeholders)

7. Layout & Navigation Chrome (src/components/layout/)
   ├── Header.tsx (Search pill, live badge, unit toggle)
   ├── BottomNav.tsx (Mobile bottom bar)
   └── Toast.tsx (Toast notification dispatcher)

8. Physics & Atmospheric Engine (src/components/weather/AtmosphereCanvas.tsx)
   └── Procedural Canvas 2D particle simulation.

9. Core Feature Components (src/components/weather/)
   ├── HeroSection.tsx (Current condition, temperature, live astronomical clock)
   ├── HourlyTimeline.tsx (24-hour horizontal scrubber)
   ├── WeatherChart.tsx (Interactive touch Bezier graph)
   └── DailyForecast.tsx (10-day range spectrum accordion)

10. Bento Grid Diagnostics (src/components/modules/)
    ├── WindCompass.tsx, UVGauge.tsx, AQIGauge.tsx, SolarArc.tsx
    └── ComfortIndex.tsx, PrecipTimeline.tsx, StoryProgression.tsx, WeatherStatCard.tsx

11. Modal Workflows (src/components/modals/)
    ├── SearchModal.tsx (Autocomplete & Geolocation)
    ├── SettingsModal.tsx (Preferences sheet)
    └── ComparisonModal.tsx (Multi-city differential analytics)

12. App Shell Composition & Root Layout (src/app/)
    ├── layout.tsx (Metadata, viewport, font preconnects, provider mounting)
    └── page.tsx (Single-page component assembly)
```

---

## 10. Component Construction Units

### Unit 1: Foundation Types & Utilities
* **Location:** `src/types/weather.ts`, `src/utils/constants.ts`, `src/utils/storage.ts`, `src/utils/meteorology.ts`
* **Depends On:** None (Pure TypeScript/JavaScript)
* **Used By:** Entire application
* **Provides:** Data models, unit converters, astronomical formulas, and storage safety.
* **Implementation Order:** 1

### Unit 2: Meteorological Network Service
* **Location:** `src/services/weatherApi.ts`
* **Depends On:** Unit 1
* **Used By:** `WeatherContext`, `SearchModal`, `ComparisonModal`
* **Provides:** `WeatherAPI.fetchFullWeather`, `WeatherAPI.searchLocations`, `WeatherAPI.reverseGeocode`.
* **Implementation Order:** 2

### Unit 3: Reactive State Container
* **Location:** `src/context/WeatherContext.tsx`
* **Depends On:** Unit 1, Unit 2
* **Used By:** All React UI components
* **Provides:** `WeatherProvider`, `useWeather()` hook.
* **Implementation Order:** 3

### Unit 4: Atmospheric Simulation System
* **Location:** `src/components/weather/AtmosphereCanvas.tsx`
* **Depends On:** Unit 1, Unit 3
* **Used By:** `src/app/page.tsx`
* **Provides:** GPU-accelerated background particle effects.
* **Implementation Order:** 4

### Unit 5: Core Meteorological Visualizers
* **Location:** `src/components/weather/HeroSection.tsx`, `HourlyTimeline.tsx`, `WeatherChart.tsx`, `DailyForecast.tsx`
* **Depends On:** Unit 1, Unit 3, `src/components/ui/WeatherIcon.tsx`
* **Used By:** `src/app/page.tsx`
* **Provides:** Main visual interface for current, hourly, graph, and 10-day forecasts.
* **Implementation Order:** 5

### Unit 6: Bento Grid Diagnostics
* **Location:** `src/components/modules/*`, `src/components/weather/BentoGrid.tsx`
* **Depends On:** Unit 1, Unit 3
* **Used By:** `src/app/page.tsx`
* **Provides:** Environmental diagnostic widgets (Wind, UV, AQI, Solar, Comfort, Precipitation).
* **Implementation Order:** 6

### Unit 7: Overlay Workflows & Modals
* **Location:** `src/components/modals/*`
* **Depends On:** Unit 1, Unit 2, Unit 3
* **Used By:** `src/app/page.tsx`
* **Provides:** City search, preferences configuration, and multi-city comparison sheets.
* **Implementation Order:** 7

---

## 11. Reusable Components and Shared Systems

### Shared UI System
- **`WeatherIcon` (`src/components/ui/WeatherIcon.tsx`)**: Reusable SVG icon renderer accepting `type`, `size`, and `className`. Resolves any standard WMO condition into a sharp, vector visual with zero external asset requests.
- **`SkeletonView` (`src/components/ui/SkeletonView.tsx`)**: Reusable structural placeholder matching the exact layout of Hero, Timeline, Chart, and Bento grid.

### Design Tokens & Utilities (`src/app/globals.css`)
- **`.glass-panel`**: Uniform glassmorphic card utility with backdrop blur, semi-transparent background, subtle top border highlight, and dark/light mode adaptivity.
- **`.glass-btn`**: Circular or pill-shaped glass action button with active scale feedback (`active:scale-95`).
- **`.weather-gradient-layer` & `.weather-ambient-layer`**: Fixed viewport background layers dynamically controlled by CSS variables mapped to `data-weather` attributes.

---

## 12. Technical Architecture & Decisions

### 1. Rendering Strategy
- **Client-Side Rendering (CSR) with Static Pre-rendering**: The root application shell (`layout.tsx`) is statically optimized by Next.js, while the dynamic weather interface runs as a rich client application (`'use client'`) to manage continuous canvas particle physics, interactive Bezier curve touch scrubbing, live 1-second clock updates, and client-side geolocation.

### 2. Canvas 2D Particle Engine
- Uses an optimized 2D canvas particle simulation in `AtmosphereCanvas.tsx` instead of heavy 3D WebGL libraries (Three.js/Babylon.js).
- Particles (sun motes, rain vectors, snowflakes, stars, clouds) update position and wrap viewport boundaries with minimal CPU/GPU overhead.
- Includes a GPU throttle option in settings (`full` / `reduced` / `off`) for low-power devices.

### 3. Financial-Grade Trend Curve
- `WeatherChart.tsx` builds quadratic/cubic Bezier curves natively on HTML5 Canvas.
- Avoids large charting bundles (Chart.js / Recharts) saving over 150 kB in bundle size.
- Touch/mouse scrubbing computes closest Euclidean distance to x-coordinates in microsecond execution time.

### 4. Zero API-Key Architecture
- Leverages the open-access Open-Meteo API network for weather forecasts, air quality indices, and geocoding.
- Eliminates exposed secrets, rate limits for basic usage, and mandatory backend proxy requirements.

---

## 13. External Services and APIs

| External Service | Endpoint / URL | Purpose | Integration Point |
| :--- | :--- | :--- | :--- |
| **Open-Meteo Weather Forecast** | `https://api.open-meteo.com/v1/forecast` | Current, 24h hourly, 10-day daily forecasts | `src/services/weatherApi.ts` (`fetchFullWeather`) |
| **Open-Meteo Air Quality API** | `https://air-quality-api.open-meteo.com/v1/air-quality` | European & US AQI, PM2.5, PM10, NO₂, O₃, CO | `src/services/weatherApi.ts` (`fetchFullWeather`) |
| **Open-Meteo Geocoding** | `https://geocoding-api.open-meteo.com/v1/search` | Fast municipality & coordinates autocomplete | `src/services/weatherApi.ts` (`searchLocations`) |
| **BigDataCloud Geocoding** | `https://api.bigdatacloud.net/data/reverse-geocode-client` | Reverse GPS coordinates to city name | `src/services/weatherApi.ts` (`reverseGeocode`) |
| **Google Fonts CDN** | `https://fonts.googleapis.com` | Web typography (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`) | `src/app/layout.tsx` |

---

## 14. Important Architectural Patterns

1. **Provider Pattern**: Centralizes state in `WeatherProvider` and exposes it via a type-safe `useWeather()` custom hook.
2. **Service Layer Pattern**: All network requests and external endpoint logic are isolated inside `WeatherAPI` class methods.
3. **Data Normalization Pattern**: Raw upstream API payloads with varying naming conventions (`temperature_2m`, `precipitation_probability_max`) are parsed into immutable, strictly-typed domain objects (`WeatherData`, `CurrentWeather`, `HourlyItem`, `DailyItem`).
4. **Domain-Driven Meteorology Module**: Mathematical calculations (heat index, apparent temperature, dew point, Julian Day moon phase, WMO translation) are encapsulated in pure, testable functions in `src/utils/meteorology.ts`.
5. **Frame-Loop Animation Pattern**: `AtmosphereCanvas` uses standard `requestAnimationFrame` with proper cleanup in `useEffect` return hooks to prevent memory leaks.
6. **Optimistic Local Caching**: Instant UI hydration on application mount by reading `aura_cached_weather` from `localStorage` while fresh network data loads in the background.

---

## 15. Complete Architecture Diagram

```text
                               ┌──────────────────────────────────────────────┐
                               │               AURA APPLICATION               │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │       WeatherProvider        │
                                       │  (src/context/WeatherContext) │
                                       └──────────────┬───────────────┘
                                                      │
                     ┌────────────────────────────────┼────────────────────────────────┐
                     │                                │                                │
                     ▼                                ▼                                ▼
      ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────┐
      │      Layout & Chrome         │ │    Weather Presentation      │ │      Modals & Overlays       │
      ├──────────────────────────────┤ ├──────────────────────────────┤ ├──────────────────────────────┤
      │ • Header.tsx                 │ │ • AtmosphereCanvas.tsx       │ │ • SearchModal.tsx            │
      │ • BottomNav.tsx              │ │ • HeroSection.tsx            │ │ • SettingsModal.tsx          │
      │ • Toast.tsx                  │ │ • HourlyTimeline.tsx         │ │ • ComparisonModal.tsx        │
      │                              │ │ • WeatherChart.tsx           │ │                              │
      │                              │ │ • DailyForecast.tsx          │ │                              │
      │                              │ │ • BentoGrid.tsx              │ │                              │
      │                              │ │   ├── WindCompass.tsx        │ │                              │
      │                              │ │   ├── UVGauge.tsx            │ │                              │
      │                              │ │   ├── AQIGauge.tsx           │ │                              │
      │                              │ │   ├── SolarArc.tsx           │ │                              │
      │                              │ │   ├── ComfortIndex.tsx       │ │                              │
      │                              │ │   ├── PrecipTimeline.tsx     │ │                              │
      │                              │ │   ├── StoryProgression.tsx   │ │                              │
      │                              │ │   └── WeatherStatCard.tsx    │ │                              │
      └──────────────────────────────┘ └──────────────────────────────┘ └──────────────────────────────┘
                     │                                │                                │
                     └────────────────────────────────┼────────────────────────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │        Domain Layer          │
                                       │   (src/utils/meteorology.ts) │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │        Service Layer         │
                                       │ (src/services/weatherApi.ts) │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │        External APIs         │
                                       │  • Open-Meteo Forecast       │
                                       │  • Open-Meteo Air Quality    │
                                       │  • Open-Meteo Geocoding      │
                                       │  • BigDataCloud Reverse Geo  │
                                       └──────────────────────────────┘
```

---

## 16. Development & Extension Guide

### If Extending or Modifying Features

1. **Adding a New Weather Diagnostic Module**:
   - Define any new data fields in `src/types/weather.ts`.
   - Add calculation logic in `src/utils/meteorology.ts` and map API data in `src/services/weatherApi.ts`.
   - Create the widget component in `src/components/modules/MyNewModule.tsx` using `.glass-panel`.
   - Mount it inside `src/components/weather/BentoGrid.tsx`.

2. **Modifying Themes or Weather Lighting**:
   - Update color variables in `src/app/globals.css` under the corresponding `[data-weather="..."]` selector.
   - Use custom Tailwind utilities (`glass-panel`, `glass-btn`, `shadow-glass`) to inherit atmospheric tokens automatically.

3. **Adding a New User Preference**:
   - Extend `Settings` interface in `src/types/weather.ts`.
   - Update default values in `src/utils/constants.ts`.
   - Add selector row in `src/components/modals/SettingsModal.tsx` calling `updateSettings({ mySetting: value })`.
