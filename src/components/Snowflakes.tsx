'use client';

import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const Snowflakes: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    // Function to draw a snowflake shape
    const drawSnowflake = (
      x: number,
      y: number,
      radius: number,
      rotation: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = radius / 8;
      ctx.lineCap = 'round';

      // Draw 6 branches
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);

        // Main branch
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);
        ctx.stroke();

        // Side branches
        for (let j = 1; j <= 3; j++) {
          const y = (-radius * j) / 3;
          const branchLength = radius / 4;

          // Left branch
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(
            -branchLength * Math.cos(Math.PI / 6),
            y - branchLength * Math.sin(Math.PI / 6)
          );
          ctx.stroke();

          // Right branch
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(
            branchLength * Math.cos(Math.PI / 6),
            y - branchLength * Math.sin(Math.PI / 6)
          );
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    // Snowflake properties
    const snowflakes: Snowflake[] = [];
    const numSnowflakes = 100;

    // Initialize snowflakes
    for (let i = 0; i < numSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 3,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update snowflakes
      snowflakes.forEach((flake) => {
        // Draw the snowflake shape
        drawSnowflake(flake.x, flake.y, flake.radius, flake.rotation, flake.opacity);

        // Update position
        flake.y += flake.speed;
        flake.x += flake.drift;
        flake.rotation += flake.rotationSpeed;

        // Reset snowflake if it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
};

export default Snowflakes;
