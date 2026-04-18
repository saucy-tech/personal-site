'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

// Props for GalaxyBackground, allowing optional children to render on top of the canvas
interface GalaxyBackgroundProps {
  children?: ReactNode;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mq.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      mq.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  useEffect(() => {
    // Retrieve CSS variables or fallback to defaults
    const computedStyle = getComputedStyle(document.documentElement);
    const rawBg = computedStyle.getPropertyValue('--background').trim();
    const rawAccent = computedStyle.getPropertyValue('--accent').trim();
    const background = rawBg || '#07251F';
    const accent = rawAccent || '#D4AF37';

    // Helper to convert hex color to RGB
    const hexToRgb = (hex: string) => {
      let sanitizedHex = hex.replace('#', '');
      if (sanitizedHex.length === 3) {
        sanitizedHex = sanitizedHex
          .split('')
          .map((c) => c + c)
          .join('');
      }
      const intVal = parseInt(sanitizedHex, 16);
      return {
        r: (intVal >> 16) & 255,
        g: (intVal >> 8) & 255,
        b: intVal & 255,
      };
    };
    const bgRgb = hexToRgb(background);
    const accentRgb = hexToRgb(accent);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Star properties
    const stars: {
      x: number;
      y: number;
      size: number;
      brightness: number;
      speed: number;
      color: number; // 0-1 for color variation
    }[] = [];
    const numStars = 150; // Reduced star count for better performance

    const populateStars = () => {
      stars.length = 0;

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          brightness: Math.random(),
          speed: 0.005 + Math.random() * 0.02,
          color: Math.random(),
        });
      }
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawBackground = (opacity = 1) => {
      ctx.fillStyle =
        opacity === 1
          ? `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`
          : `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      stars.forEach((star) => {
        const opacity = 0.2 + Math.sin(time * 2 + star.brightness * 10) * 0.2;

        ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 3
          );
          gradient.addColorStop(0, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.125)`);
          gradient.addColorStop(1, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
    };

    const updateStars = () => {
      stars.forEach((star) => {
        star.y = (star.y + star.speed) % canvas.height;
        star.x += Math.sin(time + star.brightness) * 0.1;
        star.x = (star.x + canvas.width) % canvas.width;
      });
    };

    const drawStaticFrame = () => {
      drawBackground();
      drawStars();
    };

    const handleResize = () => {
      setCanvasSize();
      populateStars();

      if (reducedMotion) {
        drawStaticFrame();
        return;
      }

      drawBackground();
      drawStars();
    };

    setCanvasSize();
    populateStars();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number | null = null;
    let time = 0;
    let isPageVisible = !document.hidden;

    const animate = () => {
      if (!isPageVisible) {
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      time += 0.002; // Slower time increment for smoother animation

      drawBackground(0.5);
      drawStars();
      updateStars();

      animationFrameId = window.requestAnimationFrame(animate);
    };

    drawBackground();
    drawStars();

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && reducedMotion) {
        drawStaticFrame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!reducedMotion) {
      animationFrameId = window.requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {children}
    </>
  );
};

export default GalaxyBackground;
