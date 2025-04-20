'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

// Props for GalaxyBackground, allowing optional children to render on top of the canvas
interface GalaxyBackgroundProps {
  children?: ReactNode;
}

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

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

    // Initialize stars
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

    // Draw first solid background frame
    ctx.fillStyle = `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animation loop
    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      time += 0.002; // Slower time increment for smoother animation

      // Apply a semi-transparent layer to create trails
      ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.5)`; // 50% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach((star) => {
        // More subtle pulsating effect
        const opacity = 0.2 + Math.sin(time * 2 + star.brightness * 10) * 0.2;

        // Subtle color variation around the accent color
        ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional subtle glow effect for larger stars
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
          gradient.addColorStop(0, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.125)`); // 12.5% opacity
          gradient.addColorStop(1, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`); // 0% opacity
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Update star position with parallax effect (more subtle)
        star.y = (star.y + star.speed) % canvas.height;
        star.x += Math.sin(time + star.brightness) * 0.1;
        star.x = (star.x + canvas.width) % canvas.width;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
