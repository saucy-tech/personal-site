'use client';

import { useEffect, useState } from 'react';

/**
 * Thin top progress bar based on overall document scroll (complements the TOC on mobile).
 */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max <= 0 ? 0 : Math.min(100, (scrollTop / max) * 100));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
