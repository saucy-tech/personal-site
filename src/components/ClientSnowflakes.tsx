'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Snowflakes from './Snowflakes';

function subscribe() {
  return () => {};
}

const ClientSnowflakes: React.FC = () => {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
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
  const snowflakesVisible = hydrated && showSnowflakes;

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
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg"
        aria-label={snowflakesVisible ? 'Hide snowflakes' : 'Show snowflakes'}
        title={snowflakesVisible ? 'Hide snowflakes' : 'Show snowflakes'}
      >
        <span className="text-2xl">{snowflakesVisible ? '❄️' : '☃️'}</span>
      </button>
    </>
  );
};

export default ClientSnowflakes;
