'use client';

import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';

/**
 * Procedural Particle Definition
 */
interface Particle {
  type: string;           // 'sun_mote' | 'star' | 'raindrop' | 'snowflake' | 'cloud_puff'
  x: number;              // Horizontal coordinate (px)
  y: number;              // Vertical coordinate (px)
  vx: number;             // Horizontal velocity vector (px/frame)
  vy: number;             // Vertical velocity vector (px/frame)
  size: number;           // Radius or stroke thickness (px)
  alpha: number;          // Current opacity (0.0 - 1.0)
  maxAlpha?: number;      // Maximum opacity limit
  pulseSpeed?: number;    // Twinkle/pulse delta per frame
  angle?: number;         // Snowflake rotation angle (radians)
  spin?: number;          // Snowflake rotational velocity
  length?: number;        // Rain streak length (px)
}

/**
 * ==============================================================================
 * ATMOSPHERE CANVAS COMPONENT (GPU-Accelerated 2D Particle Simulation)
 * ==============================================================================
 * Renders an optimized procedural HTML5 Canvas 2D particle simulation behind
 * the semi-transparent glassmorphic application shell.
 *
 * Atmospheric Effects Implemented:
 * 1. Sunny Day: Floating sun motes with soft radial golden flares
 * 2. Clear Night: Twinkling celestial stars with varying brightness
 * 3. Rain & Drizzle: Angled rain velocity streaks with wind drift
 * 4. Thunderstorm: Dense heavy rain vectors and periodic lightning flashes
 * 5. Snow: Floating snowflakes with natural air resistance and gentle spin
 * 6. Fog / Overcast: Drifting atmospheric ambient cloud puffs
 *
 * Respects user preferences: Full GPU, Reduced (Eco), or Off.
 */
export const AtmosphereCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { weatherData, settings } = useWeather();
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lightningRef = useRef<{ alpha: number; nextTime: number }>({
    alpha: 0,
    nextTime: Date.now() + 4000
  });

  const conditionCategory = weatherData?.current?.conditionCategory || 'clear';
  const isDay = weatherData?.current?.isDay ?? true;
  const atmosphereMode = settings.atmosphere; // 'full' | 'reduced' | 'off'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || atmosphereMode === 'off') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    /**
     * Resizes canvas to match device pixel ratio without excessive memory usage
     */
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      spawnParticles();
    };

    /**
     * Initializes procedural particle arrays mapped to current condition
     */
    const spawnParticles = () => {
      const isReduced = atmosphereMode === 'reduced';
      const factor = isReduced ? 0.35 : 1.0;
      const particles: Particle[] = [];

      let condKey = 'clear-day';
      if (conditionCategory === 'thunderstorm') condKey = 'thunderstorm';
      else if (conditionCategory === 'rain') condKey = 'rain';
      else if (conditionCategory === 'snow') condKey = 'snow';
      else if (conditionCategory === 'fog') condKey = 'fog';
      else if (conditionCategory === 'clouds') condKey = isDay ? 'cloudy-day' : 'cloudy-night';
      else condKey = isDay ? 'clear-day' : 'clear-night';

      switch (condKey) {
        case 'clear-day':
          for (let i = 0; i < Math.floor(25 * factor); i++) {
            particles.push({
              type: 'sun_mote',
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.4,
              vy: -0.2 - Math.random() * 0.3,
              size: 2 + Math.random() * 4,
              alpha: 0.1 + Math.random() * 0.4,
              maxAlpha: 0.5,
              pulseSpeed: 0.01 + Math.random() * 0.02
            });
          }
          break;

        case 'clear-night':
          for (let i = 0; i < Math.floor(55 * factor); i++) {
            particles.push({
              type: 'star',
              x: Math.random() * width,
              y: Math.random() * height * 0.85,
              vx: 0,
              vy: 0,
              size: 1 + Math.random() * 2.5,
              alpha: 0.2 + Math.random() * 0.8,
              maxAlpha: 1.0,
              pulseSpeed: 0.015 + Math.random() * 0.03
            });
          }
          break;

        case 'rain':
          for (let i = 0; i < Math.floor(90 * factor); i++) {
            particles.push({
              type: 'raindrop',
              x: Math.random() * width,
              y: Math.random() * height,
              vx: -1.5 - Math.random() * 1.5,
              vy: 12 + Math.random() * 10,
              size: 1.5,
              length: 14 + Math.random() * 18,
              alpha: 0.2 + Math.random() * 0.4
            });
          }
          break;

        case 'thunderstorm':
          for (let i = 0; i < Math.floor(120 * factor); i++) {
            particles.push({
              type: 'raindrop',
              x: Math.random() * width,
              y: Math.random() * height,
              vx: -2.5 - Math.random() * 2,
              vy: 16 + Math.random() * 12,
              size: 2,
              length: 20 + Math.random() * 24,
              alpha: 0.35 + Math.random() * 0.45
            });
          }
          break;

        case 'snow':
          for (let i = 0; i < Math.floor(65 * factor); i++) {
            particles.push({
              type: 'snowflake',
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 1.2,
              vy: 0.8 + Math.random() * 1.6,
              size: 2 + Math.random() * 4.5,
              alpha: 0.3 + Math.random() * 0.6,
              angle: Math.random() * Math.PI * 2,
              spin: (Math.random() - 0.5) * 0.03
            });
          }
          break;

        case 'fog':
        case 'cloudy-day':
        case 'cloudy-night':
        default:
          for (let i = 0; i < Math.floor(12 * factor); i++) {
            particles.push({
              type: 'cloud_puff',
              x: Math.random() * width,
              y: Math.random() * height * 0.6,
              vx: 0.15 + Math.random() * 0.3,
              vy: 0,
              size: 90 + Math.random() * 140,
              alpha: 0.05 + Math.random() * 0.1
            });
          }
          break;
      }

      particlesRef.current = particles;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    /**
     * Animation Frame Loop (60 FPS)
     */
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle lightning illumination for thunderstorm conditions
      if (conditionCategory === 'thunderstorm') {
        const now = Date.now();
        if (now > lightningRef.current.nextTime) {
          lightningRef.current.alpha = 0.65 + Math.random() * 0.3;
          lightningRef.current.nextTime = now + 4000 + Math.random() * 8000;
        }

        if (lightningRef.current.alpha > 0) {
          ctx.fillStyle = `rgba(230, 240, 255, ${lightningRef.current.alpha})`;
          ctx.fillRect(0, 0, width, height);
          lightningRef.current.alpha -= 0.04;
        }
      }

      // Render Individual Particles
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport boundaries
        if (p.x < -100) p.x = width + 50;
        if (p.x > width + 100) p.x = -50;
        if (p.y > height + 50) p.y = -30;
        if (p.y < -50) p.y = height + 30;

        // Pulse opacity
        if (p.pulseSpeed) {
          p.alpha += p.pulseSpeed;
          if (p.alpha > (p.maxAlpha || 0.8) || p.alpha < 0.1) {
            p.pulseSpeed = -p.pulseSpeed;
          }
        }

        ctx.save();

        if (p.type === 'sun_mote') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, `rgba(253, 224, 71, ${p.alpha})`);
          grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'star') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'raindrop') {
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + (p.length || 15));
          ctx.stroke();
        } else if (p.type === 'snowflake') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'cloud_puff') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [conditionCategory, isDay, atmosphereMode]);

  if (atmosphereMode === 'off') return null;

  return (
    <>
      <canvas
        id="atmosphere-canvas"
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none opacity-85 transition-opacity duration-500"
      />
      <div className="weather-gradient-layer" aria-hidden="true" />
      <div className="weather-ambient-layer" aria-hidden="true" />
    </>
  );
};
