/** localStorage key for site color mode (orange vs green — works in light and dark). */
export const THEME_STORAGE_KEY = 'saucy-theme';

/** localStorage key for light vs dark appearance. */
export const APPEARANCE_STORAGE_KEY = 'saucy-appearance';

export type SiteColorMode = 'orange' | 'green';

export type AppearanceMode = 'light' | 'dark';

export function applyTheme(mode: SiteColorMode) {
  if (typeof document === 'undefined') return;
  if (mode === 'green') {
    document.documentElement.setAttribute('data-theme', 'green');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
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
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
