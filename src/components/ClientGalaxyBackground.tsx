'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Load background as a client-only component so it doesn't block SSR
const GalaxyBackground = dynamic(() => import('@/components/GalaxyBackground'), {
  ssr: false,
  loading: () => null,
});

export default function ClientGalaxyBackground() {
  const pathname = usePathname();
  if (pathname !== '/') {
    return null;
  }

  return <GalaxyBackground />;
}
