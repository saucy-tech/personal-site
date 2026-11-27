'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-(--foreground)">Something went wrong!</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="a11y-focus-ring px-4 py-2 bg-(--accent) text-(--on-accent) rounded-md hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="a11y-focus-ring rounded-xs px-1 py-2 text-(--accent) underline-offset-4 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
