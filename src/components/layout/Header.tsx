import Link from 'next/link';

import { BaseProps } from '@/types';
import { SITE_NAME } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export default function Header({ className }: BaseProps) {
  return (
    <header className={cn('py-4 transparent', className)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>
      <div className="container mx-auto px-4 flex justify-center items-center">
        <nav aria-label="Main navigation" className="flex space-x-6 items-center">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
          >
            {SITE_NAME}
          </Link>
        </nav>
      </div>
    </header>
  );
}
