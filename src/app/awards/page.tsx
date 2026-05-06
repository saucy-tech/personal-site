import { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import { Award, AwardTier, awardTierLabels, awards } from '@/data/awards';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description:
    'Public-sector technology awards and recognitions earned for software delivered at the State of Georgia.',
  alternates: {
    canonical: '/awards',
  },
  openGraph: {
    title: 'Awards & Recognition',
    description:
      'Public-sector technology awards and recognitions earned for software delivered at the State of Georgia.',
    url: '/awards',
    type: 'website',
    images: [
      {
        url: '/family-photo.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - Awards & Recognition`,
      },
    ],
  },
};

const TIER_ORDER: AwardTier[] = ['headline', 'body'];

function AwardCard({ award }: { award: Award }) {
  return (
    <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold">{award.name}</h3>
        <span className="text-xs bg-white/10 text-(--text-secondary) border border-(--accent-border) px-2 py-0.5 rounded-full">
          {award.year}
        </span>
      </div>
      <p className="text-sm text-(--text-secondary) mb-1">
        <span className="font-medium text-(--text-primary)">Issuer:</span> {award.issuer}
      </p>
      {award.project && (
        <p className="text-sm text-(--text-secondary) mb-3">
          <span className="font-medium text-(--text-primary)">Project:</span> {award.project}
        </p>
      )}
      {award.impact && <p className="mb-3 text-base text-(--text-secondary)">{award.impact}</p>}
      {award.issuerLink && (
        <a
          href={award.issuerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-(--accent) underline underline-offset-2 hover:opacity-80"
        >
          Verify with issuer →
        </a>
      )}
    </div>
  );
}

export default function Awards() {
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    label: awardTierLabels[tier],
    items: awards.filter((a) => a.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <PageLayout title="Awards & Recognition">
      <section className="flex flex-col gap-10 items-center min-h-[40vh]">
        <p className="max-w-xl text-center text-(--text-secondary)">
          Recognitions earned for public-sector software delivered at the Georgia Department of
          Agriculture. National, state, and chapter-level honors for GIS, mobile field tools, and
          emergency-response platforms.
        </p>

        {grouped.map(({ tier, label, items }) => (
          <div key={tier} className="w-full max-w-xl">
            <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
              {label}
            </h2>
            <div className="flex flex-col gap-6">
              {items.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </div>
        ))}

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            See also
          </h2>
          <div className="flex flex-col gap-3">
            <LinkCard
              title="About / Experience"
              href="/about"
              icon={<span className="text-2xl">👤</span>}
              eyebrow="About"
              meta="Career narrative and résumé"
            />
            <LinkCard
              title="Portfolio"
              href="/portfolio"
              icon={<span className="text-2xl">🚀</span>}
              eyebrow="Portfolio"
              meta="Software, tools, and open source"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
