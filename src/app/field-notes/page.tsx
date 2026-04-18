import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import { fieldNotesLastUpdated, fieldNotesSections } from '@/data/field-notes';
import { formatPostDate } from '@/utils/helpers';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Field notes | ${SITE_NAME}`,
  description:
    'What I\u2019m into in tech right now — tools I\u2019m using, things I\u2019m trying, and what I\u2019m enjoying. Updated when it changes.',
  openGraph: {
    title: `Field notes | ${SITE_NAME}`,
    description:
      'What I\u2019m into in tech right now — tools I\u2019m using, things I\u2019m trying, and what I\u2019m enjoying.',
    url: `${SITE_URL}/field-notes`,
    type: 'website',
  },
};

export default function FieldNotesPage() {
  const lastUpdatedLabel = formatPostDate(fieldNotesLastUpdated);

  return (
    <PageLayout title="Field notes" backHref="/" backLabel="Back to Home">
      <div className="max-w-2xl space-y-3">
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          What I&rsquo;m into in tech right now — the tools I reach for, what I&rsquo;m evaluating,
          and things I&rsquo;m enjoying. A snapshot, updated when it changes.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="uppercase tracking-[0.14em] text-xs">
            {fieldNotesSections.map((section, i) => (
              <span key={section.id}>
                {i > 0 && <span className="text-[var(--accent-border)]"> · </span>}
                <a
                  href={`#${section.id}`}
                  className="text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-4 transition hover:decoration-[var(--accent)]"
                >
                  {section.title}
                </a>
              </span>
            ))}
          </span>
          <span className="mx-2 text-[var(--accent-border)]">•</span>
          Updated <time dateTime={fieldNotesLastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </div>

      <div className="mt-10 space-y-section">
        {fieldNotesSections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <Section title={section.title}>
              <p className="-mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                {section.blurb}
              </p>
              <div className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <article
                    key={`${section.id}-${item.title}`}
                    className="border-l-2 border-[var(--accent-border)] pl-4 sm:pl-5"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)] sm:text-lg">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {item.tags.map((tag, i) => (
                          <span key={tag}>
                            {i > 0 && <span className="text-[var(--accent-border)]"> · </span>}
                            {tag}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                      {item.note}
                      {item.link && (
                        <>
                          {' — '}
                          <a
                            href={item.link.href}
                            target={/^https?:\/\//.test(item.link.href) ? '_blank' : undefined}
                            rel={
                              /^https?:\/\//.test(item.link.href)
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="text-[var(--accent)] underline underline-offset-2 transition hover:opacity-80"
                          >
                            {item.link.label ?? 'link'}
                          </a>
                        </>
                      )}
                    </p>
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
