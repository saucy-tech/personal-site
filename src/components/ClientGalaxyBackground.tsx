'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

const GalaxyBackground = dynamic(() => import('@/components/GalaxyBackground'), {
  ssr: false,
  loading: () => null,
});

function subscribeAppearance(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-appearance', 'data-theme'],
  });
  return () => obs.disconnect();
}

function isLightMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-appearance') === 'light';
}

function getServerLightSnapshot(): boolean {
  return false;
}

export default function ClientGalaxyBackground() {
  const pathname = usePathname();
  const isLight = useSyncExternalStore(subscribeAppearance, isLightMode, getServerLightSnapshot);
  const themeEpoch = useSyncExternalStore(
    subscribeAppearance,
    () =>
      `${document.documentElement.getAttribute('data-theme') ?? ''}:${document.documentElement.getAttribute('data-appearance') ?? ''}`,
    () => '0'
  );

  if (pathname !== '/') {
    return null;
  }

  if (isLight) {
    return null;
  }

  return <GalaxyBackground key={themeEpoch} />;
}
