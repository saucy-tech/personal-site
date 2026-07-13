import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME } from '@/utils/constants';
import ClientTipJar from '@/components/ClientTipJar';
import Section from '@/components/Section';
import { validators } from '@/utils/security';

export const metadata: Metadata = {
  title: 'Support Me',
  description: "Support Brandon's writing, projects, and long-term vision for his family.",
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Support Me',
    description: "Contribute to Brandon's work, family savings, or send Bitcoin.",
    url: '/support',
    type: 'website',
    images: [
      {
        url: '/headshot.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - Support Me`,
      },
    ],
  },
};

interface SupportPageProps {
  searchParams: Promise<{ memo?: string }>;
}

export default async function Support({ searchParams }: SupportPageProps) {
  const { memo: rawMemo } = await searchParams;
  const memoCheck = validators.text(rawMemo ?? '', 500);
  const initialMemo =
    memoCheck.valid && memoCheck.sanitized && memoCheck.sanitized.length > 0
      ? memoCheck.sanitized
      : undefined;

  return (
    <PageLayout title="Support Me">
      <p className="text-lg text-gray-300 mb-10 text-center">
        Choose a way to support my work and our family.
      </p>

      <div id="lightning-tip-jar">
        <Section emoji="⚡" title="Lightning Tip Jar">
          {/* TipJar is client-only: placeholder shown during SSR */}
          <ClientTipJar key={initialMemo ?? 'default'} initialMemo={initialMemo} />
        </Section>
      </div>

      <Section emoji="🎓" title={"Gift to My Son's 529 Plan"}>
        <div className="w-full max-w-md mx-auto p-6">
          <div className="border border-(--accent-border) rounded-lg p-6">
            <p className="text-(--text-secondary) mb-3">
              Invest in my son&apos;s future through our Ugift code:
            </p>
            <a
              href="https://www.ugift529.com/gifttpl/ugift/create/viewGiftCodeDetails.cs?ugiftcode=21W-40K"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm wrap-break-word bg-black/40 p-3 rounded-sm underline hover:bg-(--accent-transparent)"
            >
              21W-40K
            </a>
          </div>
        </div>
      </Section>

      <Section emoji="🏦" title={"Gift to My Son's Trump Account"}>
        <div className="w-full max-w-md mx-auto p-6">
          <div className="border border-(--accent-border) rounded-lg p-6">
            <p className="text-(--text-secondary) mb-4">
              Family and friends can email me for the private contribution link.
            </p>
            <a
              href="mailto:brandon@saucy.tech?subject=Trump%20Account%20contribution%20link"
              className="inline-block rounded-sm bg-(--accent) px-4 py-2 text-sm font-medium text-(--on-accent) transition hover:bg-(--accent-dark)"
            >
              Request the contribution link
            </a>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
