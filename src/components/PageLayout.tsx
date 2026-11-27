import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { cn } from '@/utils/helpers';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  /** Renders a back link only when set. Top-level routes rely on the header nav instead. */
  backHref?: string;
  backLabel?: string;
  readingWidth?: boolean;
}

/**
 * Page body inside the root layout's `<main>`, which already supplies the min-height
 * shell, the max width, and the side padding. This only adds vertical rhythm and,
 * with `readingWidth`, a narrower measure.
 */
export default function PageLayout({
  children,
  title,
  backHref,
  backLabel = 'Back to Home',
  readingWidth = false,
}: PageLayoutProps) {
  return (
    <div className={cn('mx-auto w-full py-8', readingWidth && 'max-w-3xl')}>
      {backHref && (
        <Link
          href={backHref}
          className="a11y-focus-ring mb-8 inline-flex items-center rounded-xs text-(--accent) transition-opacity hover:opacity-80"
        >
          <ArrowLeftIcon aria-hidden="true" className="h-5 w-5 mr-2" />
          {backLabel}
        </Link>
      )}

      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="space-y-8">{children}</div>
    </div>
  );
}
