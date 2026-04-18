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
        'inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] p-0.5 font-mono text-[10px] uppercase tracking-wider sm:text-xs',
        className
      )}
      role="group"
      aria-label="Site color mode"
      suppressHydrationWarning
    >
      <button
        type="button"
        onClick={() => select('orange')}
        className={cn(
          'rounded-full px-2.5 py-1 transition sm:px-3',
          mode === 'orange'
            ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        )}
      >
        Orange
      </button>
      <button
        type="button"
        onClick={() => select('green')}
        className={cn(
          'rounded-full px-2.5 py-1 transition sm:px-3',
          mode === 'green'
            ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        )}
      >
        Green
      </button>
    </div>
  );
}
