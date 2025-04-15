"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GalaxyBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cssVars, setCssVars] = useState({
    background: '#07251F',
    accent: '#D4AF37'
  });

  useEffect(() => {
    // Get CSS variables for consistent colors
    const computedStyle = getComputedStyle(document.documentElement);
    setCssVars({
      background: computedStyle.getPropertyValue('--background').trim(),
      accent: computedStyle.getPropertyValue('--accent').trim()
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

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
        color: Math.random()
      });
    }

    // Draw first solid background frame
    ctx.fillStyle = cssVars.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animation loop
    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      time += 0.002; // Slower time increment for smoother animation
      
      // Apply a semi-transparent layer to create trails
      ctx.fillStyle = `${cssVars.background}80`; // 50% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach((star) => {
        // More subtle pulsating effect
        const opacity = 0.2 + Math.sin(time * 2 + star.brightness * 10) * 0.2;
        
        // Subtle color variation around the accent color
        
        ctx.fillStyle = `${cssVars.accent}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional subtle glow effect for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `${cssVars.accent}20`); // 12.5% opacity
          gradient.addColorStop(1, `${cssVars.accent}00`); // 0% opacity
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Update star position with parallax effect (more subtle)
        star.y = (star.y + star.speed) % canvas.height;
        star.x += Math.sin(time + star.brightness) * 0.1;
        star.x = ((star.x + canvas.width) % canvas.width);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--background)]">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default GalaxyBackground;
