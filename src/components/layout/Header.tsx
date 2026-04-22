import Link from 'next/link';

import AppearanceToggle from '@/components/AppearanceToggle';
import SiteNav from '@/components/layout/SiteNav';
import ThemeToggle from '@/components/ThemeToggle';
import type { SiteNavItem } from '@/config/site-nav';
import { BaseProps } from '@/types';
import { SITE_NAME } from '@/utils/constants';
import { cn } from '@/utils/helpers';

type HeaderProps = BaseProps & {
  navItems: SiteNavItem[];
};

export default function Header({ className, navItems }: HeaderProps) {
  return (
    <header className={cn('py-4 transparent', className)}>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:top-4 focus-visible:left-4 focus-visible:rounded focus-visible:bg-[var(--accent)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-[var(--on-accent)]"
      >
        Skip to content
      </a>
      <div className="container mx-auto flex flex-col gap-3 px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 justify-start">
            <ThemeToggle />
          </div>
          <nav aria-label="Main navigation" className="flex justify-center">
            <Link
              href="/"
              className="a11y-focus-ring rounded-sm text-center text-xl font-bold text-[var(--accent)] transition-opacity hover:opacity-80"
            >
              {SITE_NAME}
            </Link>
          </nav>
          <div className="flex min-w-0 justify-end">
            <AppearanceToggle />
          </div>
        </div>
        <SiteNav items={navItems} ariaLabel="Site sections" />
      </div>
    </header>
  );
}
