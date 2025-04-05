import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link
          href="/"
          className="inline-flex items-center text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
