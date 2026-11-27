'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { applyTheme, type SiteColorMode } from '@/utils/theme';
import { cn } from '@/utils/helpers';

function readMode(): SiteColorMode {
  if (typeof document === 'undefined') return 'orange';
  return document.documentElement.getAttribute('data-theme') === 'green' ? 'green' : 'orange';
}

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-appearance'],
  });
  return () => obs.disconnect();
}

function getServerSnapshot(): SiteColorMode {
  return 'orange';
}

export default function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, readMode, getServerSnapshot);

  const select = useCallback((next: SiteColorMode) => {
    applyTheme(next);
  }, []);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-(--accent-border) bg-(--accent-transparent) p-0.5 font-mono uppercase tracking-wider',
        className
      )}
      role="group"
      aria-label="Site color mode"
      suppressHydrationWarning
    >
      <button
        type="button"
        onClick={() => select('orange')}
        aria-pressed={mode === 'orange'}
        className={cn(
          'a11y-focus-ring rounded-full px-3 py-1.5 text-xs transition',
          mode === 'orange'
            ? 'bg-(--accent) text-(--on-accent) shadow-xs'
            : 'text-(--text-secondary) hover:text-(--text-primary)'
        )}
      >
        Orange
      </button>
      <button
        type="button"
        onClick={() => select('green')}
        aria-pressed={mode === 'green'}
        className={cn(
          'a11y-focus-ring rounded-full px-3 py-1.5 text-xs transition',
          mode === 'green'
            ? 'bg-(--accent) text-(--on-accent) shadow-xs'
            : 'text-(--text-secondary) hover:text-(--text-primary)'
        )}
      >
        Green
      </button>
    </div>
  );
}
