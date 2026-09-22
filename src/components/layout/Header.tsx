import Link from 'next/link';

import SiteNav from '@/components/layout/SiteNav';
import type { SiteNavItem } from '@/config/site-nav';
import { BaseProps } from '@/types';
import { SITE_NAME } from '@/utils/constants';
import { cn } from '@/utils/helpers';

// Below `sm` the seven section links would wrap to two rows; keep them on one row
// that scrolls sideways instead. The right-edge mask hints that the row continues,
// and the end padding lets the last link scroll clear of it.
const mobileNavRowClass =
  'max-sm:-mx-4 max-sm:flex-nowrap max-sm:justify-start max-sm:overflow-x-auto max-sm:whitespace-nowrap max-sm:px-4 max-sm:py-1 max-sm:pr-12 max-sm:[scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,black_88%,transparent)]';

type HeaderProps = BaseProps & {
  navItems: SiteNavItem[];
};

export default function Header({ className, navItems }: HeaderProps) {
  return (
    <header className={cn('py-4 transparent', className)}>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:top-4 focus-visible:left-4 focus-visible:rounded-sm focus-visible:bg-(--accent) focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-(--on-accent)"
      >
        Skip to content
      </a>
      <div className="container mx-auto flex flex-col gap-3 px-4">
        <div className="flex justify-center">
          <nav aria-label="Main navigation" className="flex justify-center">
            <Link
              href="/"
              className="a11y-focus-ring rounded-xs text-center text-xl font-bold text-(--accent) transition-opacity hover:opacity-80"
            >
              {SITE_NAME}
            </Link>
          </nav>
        </div>
        <SiteNav items={navItems} ariaLabel="Site sections" listClassName={mobileNavRowClass} />
      </div>
    </header>
  );
}
