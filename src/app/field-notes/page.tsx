import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import { fieldNotesLastUpdated, fieldNotesSections } from '@/data/field-notes';
import { formatPostDate } from '@/utils/helpers';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Field notes | ${SITE_NAME}`,
  description:
    'What I\u2019m into in tech right now — tools I\u2019m using and things I\u2019m trying. Updated when it changes.',
  alternates: {
    canonical: '/field-notes',
  },
  openGraph: {
    title: `Field notes | ${SITE_NAME}`,
    description:
      'What I\u2019m into in tech right now — tools I\u2019m using and things I\u2019m trying.',
    url: '/field-notes',
    type: 'website',
  },
};

export default function FieldNotesPage() {
  const lastUpdatedLabel = formatPostDate(fieldNotesLastUpdated);

  return (
    <PageLayout title="Field notes" backHref="/" backLabel="Back to Home">
      <div className="max-w-2xl space-y-3">
        <p className="text-base leading-relaxed text-(--text-secondary)">
          What I&rsquo;m into in tech right now — the tools I reach for and what I&rsquo;m still
          evaluating. A snapshot, updated when it changes.
        </p>
        <p className="text-sm text-(--text-secondary)">
          <span className="uppercase tracking-[0.14em] text-xs">
            {fieldNotesSections.map((section, i) => (
              <span key={section.id}>
                {i > 0 && <span className="text-(--accent-border)"> · </span>}
                <a
                  href={`#${section.id}`}
                  className="text-(--accent) underline decoration-(--accent-border) underline-offset-4 transition hover:decoration-(--accent)"
                >
                  {section.title}
                </a>
              </span>
            ))}
          </span>
          <span className="mx-2 text-(--accent-border)">•</span>
          Updated <time dateTime={fieldNotesLastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </div>

      <div className="mt-10 max-w-3xl space-y-12">
        {fieldNotesSections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <header className="border-t border-(--accent-border) pt-5">
              <h2 className="text-lg font-semibold leading-tight text-(--text-primary)">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-(--text-secondary)">{section.blurb}</p>
            </header>

            <div className="mt-5 space-y-5">
              {section.items.map((item) => (
                <article
                  key={`${section.id}-${item.title}`}
                  className="border-l-2 border-(--accent-border) py-0.5 pl-4"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold leading-snug text-(--text-primary)">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--accent)">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <p className="mt-1 text-xs text-(--text-secondary)">
                      {item.tags.map((tag, i) => (
                        <span key={tag}>
                          {i > 0 && <span className="text-(--accent-border)"> · </span>}
                          {tag}
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                    {item.note}
                    {item.link && (
                      <>
                        {' — '}
                        <a
                          href={item.link.href}
                          target={/^https?:\/\//.test(item.link.href) ? '_blank' : undefined}
                          rel={
                            /^https?:\/\//.test(item.link.href) ? 'noopener noreferrer' : undefined
                          }
                          className="text-(--accent) underline underline-offset-2 transition hover:opacity-80"
                        >
                          {item.link.label ?? 'link'}
                        </a>
                      </>
                    )}
                  </p>
                  {((item.pros && item.pros.length > 0) || (item.cons && item.cons.length > 0)) && (
                    <div className="mt-3 space-y-1 text-xs leading-relaxed text-(--text-secondary)">
                      {item.pros?.map((pro) => (
                        <p key={pro}>
                          <span className="font-mono text-(--accent)">+</span> {pro}
                        </p>
                      ))}
                      {item.cons?.map((con) => (
                        <p key={con}>
                          <span className="font-mono text-(--text-secondary)">-</span> {con}
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-(--accent-border) pt-8 text-sm leading-relaxed text-(--text-secondary)">
        <p>
          Related:{' '}
          <Link
            href="/bitcoin"
            className="text-(--accent) underline underline-offset-2 transition hover:opacity-80"
          >
            Bitcoin
          </Link>
          {' · '}
          <Link
            href="/blog"
            className="text-(--accent) underline underline-offset-2 transition hover:opacity-80"
          >
            Blog
          </Link>
        </p>
      </footer>
    </PageLayout>
  );
}
