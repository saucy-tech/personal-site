import { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import { awards } from '@/data/awards';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Brandon Sauceda — software engineer building public-sector technology, indie tools, and Bitcoin-native experiences.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Brandon',
    description:
      'Software engineer building public-sector technology, indie tools, and Bitcoin-native experiences.',
    url: '/about',
    type: 'profile',
    images: [
      {
        url: '/family-photo.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - About`,
      },
    ],
  },
};

// Set to a real path under /public when the sanitized résumé PDF is uploaded.
// Example: '/resume/brandon-sauceda-resume.pdf'
const RESUME_PDF_PATH: string | null = null;

const HIGHLIGHTS: string[] = [
  'Software engineer at the Georgia Department of Agriculture, building mobile field tools, GIS systems, and emergency-response platforms used by state regulators and the public.',
  'Recognized nationally and at the state level for innovation: Esri SAG (2020), NASCIO finalist (2019), and multiple GMIS and GTA awards (2019–2026).',
  'Indie builder shipping React/Next.js apps, Rust desktop tools, and Lightning Network integrations on the side.',
  'Open-source contributor: Warp terminal, Abbot (Bitcoin/Lightning bot), and the Plebnet website.',
  'Writer of The Daily Word — a weekday scripture devotion read by a small but loyal email list.',
];

export default function About() {
  const headlineAwards = awards.filter((a) => a.tier === 'headline');

  return (
    <PageLayout title="About">
      <section className="flex flex-col gap-10 items-center min-h-[40vh]">
        <div className="w-full max-w-xl space-y-4 text-(--text-secondary)">
          <p>
            I&rsquo;m Brandon Sauceda &mdash; a software engineer who loves Jesus, builds for
            people, and saves in Bitcoin. By day I deliver software for the State of Georgia. By
            night and on weekends I write, tinker with side projects, and share the gospel.
          </p>
          <p>
            My professional work centers on GIS, mobile field data collection, and
            emergency-response platforms &mdash; the kind of tools that quietly make state
            government work better. Outside of that, I build small tools that scratch real itches
            and contribute to open-source projects in the Bitcoin and Lightning ecosystem.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            Career highlights
          </h2>
          <ul className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6 space-y-3 list-disc list-inside text-(--text-secondary)">
            {HIGHLIGHTS.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            Selected recognition
          </h2>
          <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6 space-y-3">
            {headlineAwards.map((award) => (
              <div key={award.id}>
                <p className="text-base text-(--text-primary) font-medium">{award.name}</p>
                <p className="text-sm text-(--text-secondary)">
                  {award.issuer} &middot; {award.year}
                </p>
              </div>
            ))}
            <a
              href="/awards"
              className="inline-block mt-2 text-sm text-(--accent) underline underline-offset-2 hover:opacity-80"
            >
              See all awards →
            </a>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            Résumé
          </h2>
          <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6 space-y-4">
            <p className="text-(--text-secondary) text-sm">
              For full work history, dates, and accomplishments &mdash; download the PDF. For
              references, salary history, or details on non-public projects, reach out by email.
            </p>
            {RESUME_PDF_PATH ? (
              <a
                href={RESUME_PDF_PATH}
                className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
                download
              >
                Download résumé (PDF)
              </a>
            ) : (
              <p className="text-xs text-(--text-secondary) italic">
                Résumé PDF coming soon. In the meantime, reach out via the social links on the home
                page.
              </p>
            )}
          </div>
        </div>

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            See also
          </h2>
          <div className="flex flex-col gap-3">
            <LinkCard
              title="Awards & Recognition"
              href="/awards"
              icon={<span className="text-2xl">🏆</span>}
              eyebrow="Awards"
              meta="National, state, and chapter-level honors"
            />
            <LinkCard
              title="Portfolio"
              href="/portfolio"
              icon={<span className="text-2xl">🚀</span>}
              eyebrow="Portfolio"
              meta="Software, tools, and open source"
            />
            <LinkCard
              title="Writing"
              href="/blog"
              icon={<span className="text-2xl">📚</span>}
              eyebrow="Blog"
              meta="Essays and reflections"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
