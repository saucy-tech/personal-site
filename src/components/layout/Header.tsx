'use client';

import Link from 'next/link';
import { BaseProps } from '@/types';
import { cn } from '@/utils/helpers';
import { SITE_NAME } from '@/utils/constants';

export default function Header({ className }: BaseProps) {
  return (
    <header className={cn('py-4 transparent', className)}>
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link href="/" className="text-xl font-bold text-[var(--accent)] hover:opacity-80 transition-opacity">
          {SITE_NAME}
        </Link>
      </div>
    </header>
  );
}

