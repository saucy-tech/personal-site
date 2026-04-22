'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useSyncExternalStore } from 'react';
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
  const [canMountGalaxy, setCanMountGalaxy] = useState(false);
  const themeEpoch = useSyncExternalStore(
    subscribeAppearance,
    () =>
      `${document.documentElement.getAttribute('data-theme') ?? ''}:${document.documentElement.getAttribute('data-appearance') ?? ''}`,
    () => '0'
  );

  useEffect(() => {
    if (pathname !== '/' || isLight || canMountGalaxy) {
      return;
    }

    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: number | null = null;

    const mountWhenIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleCallbackId = window.requestIdleCallback(
          () => {
            if (!cancelled) {
              setCanMountGalaxy(true);
            }
          },
          { timeout: 1200 }
        );
        return;
      }

      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setCanMountGalaxy(true);
        }
      }, 250);
    };

    mountWhenIdle();

    return () => {
      cancelled = true;

      if (idleCallbackId !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [canMountGalaxy, isLight, pathname]);

  if (pathname !== '/') return null;

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {!isLight && canMountGalaxy ? <GalaxyBackground key={themeEpoch} /> : null}
    </div>
  );
}
