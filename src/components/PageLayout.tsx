import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  backHref?: string;
  backLabel?: string;
}

export default function PageLayout({
  children,
  title,
  backHref = '/',
  backLabel = 'Back to Home',
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link
          href={backHref}
          className="inline-flex items-center text-[var(--accent)] hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {backLabel}
        </Link>

        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
