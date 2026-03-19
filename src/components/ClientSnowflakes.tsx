'use client';

import React, { useState } from 'react';
import Snowflakes from './Snowflakes';

const ClientSnowflakes: React.FC = () => {
  const [showSnowflakes, setShowSnowflakes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showSnowflakes');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save preference to localStorage when it changes
  const toggleSnowflakes = () => {
    const newValue = !showSnowflakes;
    setShowSnowflakes(newValue);
    localStorage.setItem('showSnowflakes', JSON.stringify(newValue));
  };

  return (
    <>
      {showSnowflakes && <Snowflakes />}
      <button
        onClick={toggleSnowflakes}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg"
        aria-label={showSnowflakes ? 'Hide snowflakes' : 'Show snowflakes'}
        title={showSnowflakes ? 'Hide snowflakes' : 'Show snowflakes'}
      >
        <span className="text-2xl">{showSnowflakes ? '❄️' : '☃️'}</span>
      </button>
    </>
  );
};

export default ClientSnowflakes;
