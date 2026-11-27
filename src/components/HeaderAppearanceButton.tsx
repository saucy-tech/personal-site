'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useSyncExternalStore } from 'react';

import { applyAppearance, type AppearanceMode } from '@/utils/theme';
import { cn } from '@/utils/helpers';

// Same store as AppearanceToggle: the source of truth is `data-appearance` on <html>,
// so this button and the footer toggle stay in sync without shared React state.
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

/** Compact light/dark switch for the header bar. A toggle button: pressed means dark mode. */
export default function HeaderAppearanceButton({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, readAppearance, getServerSnapshot);
  const isDark = mode === 'dark';
  const Icon = isDark ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      onClick={() => applyAppearance(isDark ? 'light' : 'dark')}
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'a11y-focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-(--accent-border) bg-(--accent-transparent) text-(--accent) transition-colors hover:bg-(--accent-hover)',
        className
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}
