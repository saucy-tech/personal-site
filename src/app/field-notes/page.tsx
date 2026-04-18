import type { Metadata } from 'next';
import Link from 'next/link';

import TradeoffList from '@/components/editorial/TradeoffList';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import { stateOfAiLastUpdated, stateOfAiSections } from '@/data/state-of-ai';
import { formatPostDate } from '@/utils/helpers';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Field notes | ${SITE_NAME}`,
  description:
    'Field notes on my AI stack: models, harnesses, subscriptions, and gear. Updated when things change.',
  openGraph: {
    title: `Field notes | ${SITE_NAME}`,
    description: 'Models, harnesses, subscriptions, and gear—how I use AI, in field-note form.',
    url: `${SITE_URL}/field-notes`,
    type: 'website',
  },
};

export default function FieldNotesPage() {
  const lastUpdatedLabel = formatPostDate(stateOfAiLastUpdated);

  return (
    <PageLayout title="Field notes" backHref="/" backLabel="Back to Home">
      <div className="max-w-2xl space-y-4">
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Field notes on how I use AI right now—incomplete by design. Same layout I like reading
          elsewhere: <strong className="font-medium text-[var(--text-primary)]">models</strong>{' '}
          (what I default to),{' '}
          <strong className="font-medium text-[var(--text-primary)]">harnesses</strong> (where I run
          them), <strong className="font-medium text-[var(--text-primary)]">subscriptions</strong>{' '}
          (what I pay for), then{' '}
          <strong className="font-medium text-[var(--text-primary)]">gear</strong>.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Last updated <time dateTime={stateOfAiLastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </div>

      <nav
        className="mt-8 max-w-xl border-l-2 border-[var(--accent-border)] pl-4"
        aria-label="On this page"
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          On this page
        </p>
        <ul className="mt-3 space-y-2">
          {stateOfAiSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-4 transition hover:decoration-[var(--accent)]"
              >
                <span className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                  {section.ordinal}
                </span>{' '}
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-section">
        {stateOfAiSections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <Section title={`${section.ordinal} ${section.title}`}>
              <div className="space-y-6">
                {section.items.map((item) => (
                  <article
                    key={`${section.id}-${item.index}`}
                    className="rounded-lg border border-[var(--accent-border)] bg-white/[0.03] p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-sm tabular-nums text-[var(--accent)]">
                        {item.index}
                      </span>
                      <h3 className="text-lg font-semibold leading-snug text-[var(--text-primary)] sm:text-xl">
                        {item.title}
                      </h3>
                    </div>
                    {item.tags.length > 0 && (
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        {item.tags.map((tag, i) => (
                          <span key={tag}>
                            {i > 0 && <span className="text-[var(--accent-border)]"> · </span>}
                            {tag}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                      {item.description}
                    </p>
                    <div className="mt-5">
                      <TradeoffList pros={item.pros} cons={item.cons} />
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          </div>
        ))}
      </div>

      <footer className="border-t border-[var(--accent-border)] pt-8 text-sm leading-relaxed text-[var(--text-secondary)]">
        <p>
          Related:{' '}
          <Link
            href="/bitcoin"
            className="text-[var(--accent)] underline underline-offset-2 transition hover:opacity-80"
          >
            Bitcoin
          </Link>
          {' · '}
          <Link
            href="/blog"
            className="text-[var(--accent)] underline underline-offset-2 transition hover:opacity-80"
          >
            Blog
          </Link>
        </p>
      </footer>
    </PageLayout>
  );
}
