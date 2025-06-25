import { Metadata } from 'next';

import ClientTipJar from '@/components/ClientTipJar';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Support Me',
  description: 'Support Brandon&apos;s writing, projects, and long-term vision for his family.',
  openGraph: {
    title: 'Support Me',
    description: 'Contribute to Brandon&apos;s work, family savings, or send Bitcoin.',
    url: `${SITE_URL}/support`,
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Support Me`,
      },
    ],
  },
};

export default function Support() {
  return (
    <PageLayout title="Support Me">
      <p className="text-lg text-gray-300 mb-10 text-center">
        Choose a way to support my work and our family.
      </p>

      <div id="lightning-tip-jar">
        <Section emoji="⚡" title="Lightning Tip Jar">
          {/* TipJar is client-only: placeholder shown during SSR */}
          <ClientTipJar />
        </Section>
      </div>

      <Section emoji="🎓" title={"Gift to My Son's 529 Plan"}>
        <div className="w-full max-w-md mx-auto p-6">
          <div className="border border-[var(--accent-border)] rounded-lg p-6">
            <p className="text-[var(--text-secondary)] mb-3">
              Invest in my son&apos;s future through our Ugift code:
            </p>
            <a
              href="https://www.ugift529.com/gifttpl/ugift/create/viewGiftCodeDetails.cs?ugiftcode=21W-40K"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm break-words bg-black/40 p-3 rounded underline hover:bg-[var(--accent-transparent)]"
            >
              21W-40K
            </a>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
