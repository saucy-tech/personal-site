import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Sunday Health Review',
  description: 'Information about Brandon Sauceda’s private Oura health-data integration.',
  alternates: {
    canonical: '/oura-health',
  },
};

export default function OuraHealthPage() {
  return (
    <PageLayout title="Sunday Health Review">
      <div className="mx-auto max-w-2xl space-y-8">
        <section className="space-y-4">
          <p className="text-base leading-relaxed text-(--text-secondary)">
            Sunday Health Review is a private, single-user integration that Brandon Sauceda uses to
            bring his Oura sleep, recovery, stress, and cardiovascular trends into a local weekly
            health review.
          </p>
          <p className="text-base leading-relaxed text-(--text-secondary)">
            It is not a public product, does not accept accounts, and does not provide medical
            advice. Oura data is processed for Brandon&apos;s personal use and is not sold or used
            for advertising.
          </p>
        </section>

        <section className="space-y-3 border-t border-(--accent-border) pt-6">
          <h2 className="text-xl font-semibold">Policies</h2>
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/oura-health/privacy"
              className="a11y-focus-ring rounded-xs text-(--accent) hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/oura-health/terms"
              className="a11y-focus-ring rounded-xs text-(--accent) hover:underline"
            >
              Terms of Use
            </Link>
          </div>
        </section>

        <p className="text-sm text-(--text-secondary)">
          Questions:{' '}
          <a className="text-(--accent) hover:underline" href="mailto:brandon@saucy.tech">
            brandon@saucy.tech
          </a>
        </p>
      </div>
    </PageLayout>
  );
}
