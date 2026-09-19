/** localStorage key for site color mode (orange vs green — works in light and dark). */
export const THEME_STORAGE_KEY = 'saucy-theme';

/** localStorage key for light vs dark appearance. */
export const APPEARANCE_STORAGE_KEY = 'saucy-appearance';

export type SiteColorMode = 'orange' | 'green';

export type AppearanceMode = 'light' | 'dark';

/**
 * Keeps browser chrome (Android Chrome, the installed app) on the active `--background`
 * instead of the dark default. The layout's boot script prepends its own
 * `<meta name="theme-color" data-active-theme-color>` ahead of the server-rendered
 * one — the first in tree order wins, and React's copy is left alone so hydration
 * never duplicates it. Call this after changing `data-theme` / `data-appearance`.
 */
function syncThemeColor() {
  const background = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim();
  if (background) {
    document.querySelector('meta[data-active-theme-color]')?.setAttribute('content', background);
  }
}

export function applyTheme(mode: SiteColorMode) {
  if (typeof document === 'undefined') return;
  if (mode === 'green') {
    document.documentElement.setAttribute('data-theme', 'green');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  syncThemeColor();
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function applyAppearance(mode: AppearanceMode) {
  if (typeof document === 'undefined') return;
  if (mode === 'light') {
    document.documentElement.setAttribute('data-appearance', 'light');
  } else {
    document.documentElement.removeAttribute('data-appearance');
  }
  syncThemeColor();
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
