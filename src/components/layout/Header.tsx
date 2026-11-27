import Link from 'next/link';

import HeaderAppearanceButton from '@/components/HeaderAppearanceButton';
import SiteNav from '@/components/layout/SiteNav';
import type { SiteNavItem } from '@/config/site-nav';
import { BaseProps } from '@/types';
import { SITE_NAME } from '@/utils/constants';
import { cn } from '@/utils/helpers';

type HeaderProps = BaseProps & {
  navItems: SiteNavItem[];
};

export default function Header({ className, navItems }: HeaderProps) {
  return (
    <header className={cn('border-b border-(--surface-border)', className)}>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:top-4 focus-visible:left-4 focus-visible:rounded-sm focus-visible:bg-(--accent) focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-(--on-accent)"
      >
        Skip to content
      </a>
      {/* One row: brand left, nav + appearance right. On very narrow screens the right
          cluster wraps beneath the brand and stays right-aligned. */}
      <div className="mx-auto flex w-full max-w-[min(100%,80rem)] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="a11y-focus-ring -ml-1 inline-flex min-h-10 items-center rounded-xs px-1 text-lg font-bold tracking-tight text-(--accent) transition-opacity hover:opacity-80 sm:text-xl"
        >
          {SITE_NAME}
        </Link>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SiteNav items={navItems} ariaLabel="Main navigation" listClassName="gap-x-0.5" />
          <HeaderAppearanceButton />
        </div>
      </div>
    </header>
  );
}
