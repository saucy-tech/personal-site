import type { SOCIAL_PROFILES } from '@/utils/constants';
import { cn } from '@/utils/helpers';

/**
 * Inline social marks drawn with `currentColor`, so they follow the surrounding text
 * color in every palette. Paths match `public/icons/{linkedin,github,x}-logo.svg`,
 * which hardcode Bitcoin orange and stay for other uses.
 */
const ICONS: Record<
  keyof typeof SOCIAL_PROFILES,
  { viewBox: string; d: string; evenOdd?: boolean }
> = {
  linkedIn: {
    viewBox: '0 0 32 32',
    evenOdd: true,
    d: 'M5.5 3h21A2.5 2.5 0 0 1 29 5.5v21a2.5 2.5 0 0 1-2.5 2.5h-21A2.5 2.5 0 0 1 3 26.5v-21A2.5 2.5 0 0 1 5.5 3ZM8 13h3.5v11H8V13Zm1.75-5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM14 13h3.35v1.5c.66-1.14 1.8-1.8 3.35-1.8 3.35 0 4.3 2.02 4.3 5v6.3h-3.5v-5.65c0-1.45-.28-2.55-1.8-2.55-1.62 0-2.2 1.1-2.2 2.48V24H14V13Z',
  },
  github: {
    viewBox: '0 0 24 24',
    evenOdd: true,
    d: 'M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.203 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z',
  },
  x: {
    viewBox: '0 0 32 32',
    d: 'M24.325 3h4.41l-9.636 11.013 11.336 14.987h-8.876l-6.952-9.09L6.653 29H2.24l10.307-11.78L1.672 3h9.104l6.284 8.308zm-1.548 23.36h2.444L9.445 5.501H6.823z',
  },
};

export type SocialIconName = keyof typeof ICONS;

export function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  const icon = ICONS[name];
  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('size-6', className)}
    >
      <path d={icon.d} fillRule={icon.evenOdd ? 'evenodd' : undefined} />
    </svg>
  );
}
