import React from 'react';

export default function BlogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontWeight: 800,
        fontSize: '2.2rem',
        margin: '2.5rem 0 1.2rem',
        textAlign: 'center',
        letterSpacing: '-0.01em',
        lineHeight: 1.13,
      }}
    >
      {children}
    </h1>
  );
}
