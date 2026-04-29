'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { applyAppearance, type AppearanceMode } from '@/utils/theme';
import { cn } from '@/utils/helpers';

function readAppearance(): AppearanceMode {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-appearance') === 'light' ? 'light' : 'dark';
}

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-appearance'] });
  return () => obs.disconnect();
}

function getServerSnapshot(): AppearanceMode {
  return 'dark';
}

export default function AppearanceToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, readAppearance, getServerSnapshot);

  const select = useCallback((next: AppearanceMode) => {
    applyAppearance(next);
  }, []);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-(--accent-border) bg-(--accent-transparent) p-0.5 font-mono text-[10px] uppercase tracking-wider sm:text-xs',
        className
      )}
      role="group"
      aria-label="Light or dark mode"
      suppressHydrationWarning
    >
      <button
        type="button"
        onClick={() => select('light')}
        className={cn(
          'rounded-full px-2.5 py-1 transition sm:px-3',
          mode === 'light'
            ? 'bg-(--accent) text-(--on-accent) shadow-xs'
            : 'text-(--text-secondary) hover:text-(--text-primary)'
        )}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => select('dark')}
        className={cn(
          'rounded-full px-2.5 py-1 transition sm:px-3',
          mode === 'dark'
            ? 'bg-(--accent) text-(--on-accent) shadow-xs'
            : 'text-(--text-secondary) hover:text-(--text-primary)'
        )}
      >
        Dark
      </button>
    </div>
  );
}
