'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Snowflakes from './Snowflakes';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe() {
  return () => {};
}

const ClientSnowflakes: React.FC = () => {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });
  const [showSnowflakes, setShowSnowflakes] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const saved = window.localStorage.getItem('showSnowflakes');
    if (saved === null) {
      return false;
    }

    try {
      return JSON.parse(saved);
    } catch {
      window.localStorage.removeItem('showSnowflakes');
      return false;
    }
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

  const snowflakesVisible = hydrated && showSnowflakes && !reducedMotion;
  const toggleLabel = reducedMotion
    ? showSnowflakes
      ? 'Snowflakes are hidden while Reduce Motion is enabled'
      : 'Snowflakes are off and will stay hidden while Reduce Motion is enabled'
    : snowflakesVisible
      ? 'Hide snowflakes'
      : 'Show snowflakes';
  const toggleIcon = showSnowflakes ? '❄️' : '☃️';

  // Save preference to localStorage when it changes
  const toggleSnowflakes = () => {
    const newValue = !showSnowflakes;
    setShowSnowflakes(newValue);
    window.localStorage.setItem('showSnowflakes', JSON.stringify(newValue));
  };

  return (
    <>
      {snowflakesVisible && <Snowflakes />}
      <button
        onClick={toggleSnowflakes}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-xs hover:bg-white/20 transition-all shadow-lg"
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        <span className="text-2xl">{toggleIcon}</span>
      </button>
    </>
  );
};

export default ClientSnowflakes;
