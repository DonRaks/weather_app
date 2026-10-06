'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { GraphMetric, HourlyItem } from '../../types/weather';
import { formatTemperature, formatWindSpeed } from '../../utils/meteorology';

interface Point {
  x: number;
  y: number;
  val: number;
  hour: HourlyItem;
}

export const WeatherChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { weatherData, settings, activeGraphMetric, setActiveGraphMetric } = useWeather();

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

  const getMetricValue = useCallback((hour: HourlyItem, metric: GraphMetric): number => {
    if (metric === 'temp') {
      return formatTemperature(hour.temp, tempUnit);
    } else if (metric === 'precip') {
      return hour.precipitationProbability;
    } else {
      return formatWindSpeed(hour.windSpeed, windUnit);
    }
  }, [tempUnit, windUnit]);

  const getMetricSuffix = useCallback((metric: GraphMetric): string => {
    if (metric === 'temp') return `°${tempUnit}`;
    if (metric === 'precip') return '%';
    return ` ${windUnit}`;
  }, [tempUnit, windUnit]);

  const pointsRef = useRef<Point[]>([]);
  const activeIndexRef = useRef<number>(-1);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hourlyData.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height || 220;

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

    const paddingX = 24;
    const paddingY = 28;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    const points: Point[] = hourlyData.map((hour, idx) => {
      const x = paddingX + (idx / (hourlyData.length - 1)) * chartW;
      const val = getMetricValue(hour, activeGraphMetric);
      const y = paddingY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, val, hour };
    });

    pointsRef.current = points;

    ctx.clearRect(0, 0, width, height);

    // Subtle horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 1; i <= 3; i++) {
      const gridY = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(16, gridY);
      ctx.lineTo(width - 16, gridY);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (!points.length) return;

    // Metric Colors
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

    // Bezier Area Fill
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

    // Stroke line
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
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Time Axis Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < points.length; i += 3) {
      const pt = points[i];
      ctx.fillText(pt.hour.formattedTime, pt.x, height - 6);
    }

    // Active crosshair
    if (activeIndexRef.current !== -1 && points[activeIndexRef.current]) {
      const activePt = points[activeIndexRef.current];

      ctx.beginPath();
      ctx.moveTo(activePt.x, 10);
      ctx.lineTo(activePt.x, height - 20);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = gradTop;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 4.5, 0, Math.PI * 2);
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

  const handleLeave = () => {
    activeIndexRef.current = -1;
    setTooltip(prev => ({ ...prev, visible: false }));
    drawChart();
  };

  return (
    <section className="mb-6" aria-label="Interactive weather progression chart">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/50">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-sky-400">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <span>Dynamics & Trends</span>
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="inline-flex bg-black/30 p-1 rounded-full border border-white/10 backdrop-blur-md" role="tablist">
            <button
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${activeGraphMetric === 'temp' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveGraphMetric('temp')}
              role="tab"
              aria-selected={activeGraphMetric === 'temp'}
            >
              <span>Temperature</span>
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${activeGraphMetric === 'precip' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveGraphMetric('precip')}
              role="tab"
              aria-selected={activeGraphMetric === 'precip'}
            >
              <span>Precipitation</span>
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${activeGraphMetric === 'wind' ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/25' : 'text-white/60 hover:text-white'}`}
              onClick={() => setActiveGraphMetric('wind')}
              role="tab"
              aria-selected={activeGraphMetric === 'wind'}
            >
              <span>Wind Speed</span>
            </button>
          </div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-wider">
            Drag to scrub curve
          </div>
        </div>

        <div className="relative w-full h-[200px] md:h-[240px] touch-pan-y select-none">
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
          <div
            className={`absolute top-2.5 pointer-events-none -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap transition-opacity duration-150 z-20 ${tooltip.visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: `${tooltip.x}px` }}
            aria-hidden="true"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{tooltip.time}</div>
            <div className="font-display text-base font-black text-white">{tooltip.val}</div>
            <div className="text-[11px] font-semibold text-sky-400">{tooltip.extra}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
