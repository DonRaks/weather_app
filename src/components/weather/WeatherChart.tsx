'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { GraphMetric, HourlyItem } from '../../types/weather';
import { formatTemperature, formatWindSpeed } from '../../utils/meteorology';

/**
 * Interface representing a mathematical plot point along the 24-hour curve
 */
interface Point {
  x: number;
  y: number;
  val: number;
  hour: HourlyItem;
}

/**
 * ==============================================================================
 * WEATHER CHART COMPONENT (Financial-Grade Interactive Canvas Bezier Graph)
 * ==============================================================================
 * Renders an ultra-fast HTML5 Canvas 2D cubic Bezier curve graph for:
 * - Temperature (°C / °F)
 * - Precipitation Probability (%)
 * - Wind Velocity (km/h, mph, knots)
 *
 * Supports real-time sub-millisecond touch/pointer scrubbing with animated crosshairs
 * and floating glassmorphism inspection tooltips.
 */
export const WeatherChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { weatherData, settings, activeGraphMetric, setActiveGraphMetric } = useWeather();

  // Scrubber Tooltip Floating State
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    time: string;
    val: string;
    extra: string;
  }>({
    visible: false,
    x: 0,
    time: '',
    val: '',
    extra: ''
  });

  const hourlyData = weatherData?.hourly.slice(0, 24) || [];
  const tempUnit = settings.tempUnit;
  const windUnit = settings.windUnit;

  /**
   * Extracts numerical metric value based on active graph mode
   */
  const getMetricValue = useCallback((hour: HourlyItem, metric: GraphMetric): number => {
    if (metric === 'temp') {
      return formatTemperature(hour.temp, tempUnit);
    } else if (metric === 'precip') {
      return hour.precipitationProbability;
    } else {
      return formatWindSpeed(hour.windSpeed, windUnit);
    }
  }, [tempUnit, windUnit]);

  /**
   * Returns display unit suffix
   */
  const getMetricSuffix = useCallback((metric: GraphMetric): string => {
    if (metric === 'temp') return `°${tempUnit}`;
    if (metric === 'precip') return '%';
    return ` ${windUnit}`;
  }, [tempUnit, windUnit]);

  const pointsRef = useRef<Point[]>([]);
  const activeIndexRef = useRef<number>(-1);

  /**
   * Core Canvas 2D Drawing Engine
   * Calculates dynamic scales, renders gradient area fills, cubic Bezier lines,
   * horizontal reference grid lines, and interactive crosshair scrubber pins.
   */
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hourlyData.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height || 200;

    // Handle high-density Retina/DPR displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);

    const values = hourlyData.map(h => getMetricValue(h, activeGraphMetric));
    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);

    if (activeGraphMetric === 'precip') {
      minVal = 0;
      maxVal = Math.max(100, maxVal);
    } else {
      const padding = (maxVal - minVal) * 0.25 || 2;
      minVal -= padding;
      maxVal += padding;
    }

    const paddingX = 18;
    const paddingY = 24;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    // Map hourly data points to 2D canvas coordinates
    const points: Point[] = hourlyData.map((hour, idx) => {
      const x = paddingX + (idx / (hourlyData.length - 1)) * chartW;
      const val = getMetricValue(hour, activeGraphMetric);
      const y = paddingY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, val, hour };
    });

    pointsRef.current = points;

    ctx.clearRect(0, 0, width, height);

    // 1. Subtle horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 1; i <= 3; i++) {
      const gridY = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(12, gridY);
      ctx.lineTo(width - 12, gridY);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (!points.length) return;

    // 2. Metric Palette Assignment
    let strokeColor = '#38bdf8';
    let gradTop = 'rgba(56, 189, 248, 0.35)';
    let gradBottom = 'rgba(56, 189, 248, 0)';

    if (activeGraphMetric === 'precip') {
      strokeColor = '#60a5fa';
      gradTop = 'rgba(96, 165, 250, 0.4)';
      gradBottom = 'rgba(96, 165, 250, 0)';
    } else if (activeGraphMetric === 'wind') {
      strokeColor = '#a855f7';
      gradTop = 'rgba(168, 85, 247, 0.35)';
      gradBottom = 'rgba(168, 85, 247, 0)';
    }

    // 3. Smooth Cubic Bezier Area Gradient Fill
    const fillPath = new Path2D();
    fillPath.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      fillPath.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p1.x, p1.y);
    }
    fillPath.lineTo(points[points.length - 1].x, height);
    fillPath.lineTo(points[0].x, height);
    fillPath.closePath();

    const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
    areaGrad.addColorStop(0, gradTop);
    areaGrad.addColorStop(1, gradBottom);
    ctx.fillStyle = areaGrad;
    ctx.fill(fillPath);

    // 4. Primary Curve Stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p1.x, p1.y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 5. Time Axis Reference Labels (Every 3-4 hours)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.textAlign = 'center';

    const step = width < 480 ? 4 : 3;
    for (let i = 0; i < points.length; i += step) {
      const pt = points[i];
      ctx.fillText(pt.hour.formattedTime, pt.x, height - 4);
    }

    // 6. Interactive Crosshair & Inspection Pin
    if (activeIndexRef.current !== -1 && points[activeIndexRef.current]) {
      const activePt = points[activeIndexRef.current];

      // Vertical guide crosshair line
      ctx.beginPath();
      ctx.moveTo(activePt.x, 8);
      ctx.lineTo(activePt.x, height - 16);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer glowing halo
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = gradTop;
      ctx.fill();

      // Inner solid point
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }, [hourlyData, activeGraphMetric, getMetricValue]);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  /**
   * Computes closest data point along x-axis for pointer/touch coordinates
   */
  const handlePointer = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !pointsRef.current.length) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;

    let closestDist = Infinity;
    let closestIdx = 0;

    pointsRef.current.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - x);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    activeIndexRef.current = closestIdx;
    const pt = pointsRef.current[closestIdx];
    const hour = pt.hour;

    setTooltip({
      visible: true,
      x: pt.x,
      time: hour.formattedTime === 'Now' ? 'Current' : hour.formattedTime,
      val: `${pt.val}${getMetricSuffix(activeGraphMetric)}`,
      extra: `${hour.conditionText} • ${hour.humidity}% humidity`
    });

    drawChart();
  };

  /**
   * Resets crosshair state when pointer exits canvas bounds
   */
  const handleLeave = () => {
    activeIndexRef.current = -1;
    setTooltip(prev => ({ ...prev, visible: false }));
    drawChart();
  };

  return (
    <section className="mb-4 sm:mb-6" aria-label="Interactive weather progression chart">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <span>Dynamics & Trends</span>
        </div>
      </div>

      <div className="glass-panel p-3.5 sm:p-5">
        {/* Metric Segmented Control Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 sm:mb-4">
          <div className="inline-flex bg-black/35 p-0.5 sm:p-1 rounded-full border border-white/10 backdrop-blur-md" role="tablist">
            <button
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-150 active:scale-95 ${
                activeGraphMetric === 'temp' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25 font-black' : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveGraphMetric('temp')}
              role="tab"
              aria-selected={activeGraphMetric === 'temp'}
            >
              <span>Temperature</span>
            </button>
            <button
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-150 active:scale-95 ${
                activeGraphMetric === 'precip' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25 font-black' : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveGraphMetric('precip')}
              role="tab"
              aria-selected={activeGraphMetric === 'precip'}
            >
              <span>Precipitation</span>
            </button>
            <button
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-150 active:scale-95 ${
                activeGraphMetric === 'wind' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25 font-black' : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveGraphMetric('wind')}
              role="tab"
              aria-selected={activeGraphMetric === 'wind'}
            >
              <span>Wind</span>
            </button>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-wider hidden xs:block">
            Touch to scrub
          </div>
        </div>

        {/* Canvas Scrubber Frame */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[240px] touch-pan-y select-none">
          <canvas
            ref={canvasRef}
            id="weather-interactive-chart"
            className="w-full h-full block cursor-crosshair"
            onMouseMove={(e) => handlePointer(e.clientX)}
            onMouseLeave={handleLeave}
            onTouchStart={(e) => handlePointer(e.touches[0].clientX)}
            onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
            onTouchEnd={handleLeave}
          />
          {/* Real-time Floating Tooltip */}
          <div
            className={`absolute top-2 pointer-events-none -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-2xl whitespace-nowrap transition-opacity duration-150 z-20 ${
              tooltip.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ left: `${tooltip.x}px` }}
            aria-hidden="true"
          >
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/50">{tooltip.time}</div>
            <div className="font-display text-sm sm:text-base font-black text-white">{tooltip.val}</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-sky-400">{tooltip.extra}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
