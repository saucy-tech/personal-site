'use client';

import dynamic from 'next/dynamic';

const GalaxyBackground = dynamic(() => import('@/components/GalaxyBackground'), {
  ssr: false,
  loading: () => null,
});

export default function ClientGalaxyBackground() {
  return <GalaxyBackground />;
}
