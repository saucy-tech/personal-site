import type { Metadata } from 'next';

import NotesSectionIndex from '@/components/NotesSectionIndex';
import PageLayout from '@/components/PageLayout';
import { PlanMarks } from '@/components/PlanMarks';
import { fieldNotesLastUpdated, fieldNotesSections } from '@/data/field-notes';
import { cn, formatPostDate } from '@/utils/helpers';
import { SITE_NAME } from '@/utils/constants';

const FIELD_NOTES_OG_IMAGE = '/notes/opengraph-image';

function ToolFavicon({ homepage, icon }: { homepage: string; icon?: string }) {
  let hostname: string;
  try {
    hostname = new URL(homepage).hostname;
  } catch {
    return null;
  }
  // Local product icons or 32px homepage favicons (no www.) keep the page free
  // of third-party image requests; next/image adds nothing at this size.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon ?? `/icons/tools/${hostname.replace(/^www\./, '')}.png`}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      className="inline-block h-5 w-5 shrink-0 rounded-sm bg-white/90 p-0.5 ring-1 ring-(--surface-border)"
    />
  );
}

export const metadata: Metadata = {
  title: 'Notes',
  description: 'What I’m using and doing now: AI tools, Bitcoin, church, and current projects.',
  alternates: {
    canonical: '/notes',
  },
  openGraph: {
    title: `Notes | ${SITE_NAME}`,
    description: 'What I’m using and doing now: AI tools, Bitcoin, church, and current projects.',
    url: '/notes',
    type: 'website',
    images: [
      {
        url: FIELD_NOTES_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'My AI coding stack — devices, T3 Code, coding agents, and remote infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Notes | ${SITE_NAME}`,
    description: 'What I’m using and doing now: AI tools, Bitcoin, church, and current projects.',
    images: [FIELD_NOTES_OG_IMAGE],
  },
};

export default function NotesPage() {
  const lastUpdatedLabel = formatPostDate(fieldNotesLastUpdated);
  const sections = fieldNotesSections.filter((section) => section.items.length > 0);

  return (
    <PageLayout title="Notes" readingWidth>
      <div className="max-w-2xl space-y-3">
        <p className="text-base leading-relaxed text-(--text-secondary)">
          What I’m using, learning, and spending time on. AI tools, Bitcoin, my church, and the
          projects I’m building. I update this page when something changes.
        </p>
        <p className="text-sm text-(--text-secondary)">
          Updated <time dateTime={fieldNotesLastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </div>

      <div className="mt-10 max-w-3xl md:grid md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
        <NotesSectionIndex
          sections={sections.map((section) => ({ id: section.id, title: section.title }))}
        />
        <div className="space-y-12">
          {sections.map((section) => (
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="flex items-center gap-2 text-base font-semibold leading-snug text-(--text-primary)">
                        {item.homepage && !item.marks && (
                          <ToolFavicon homepage={item.homepage} icon={item.icon} />
                        )}
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]',
                            item.badge === 'daily'
                              ? 'border-(--accent-border) bg-(--accent-transparent) text-(--accent)'
                              : 'border-(--surface-border) text-(--text-secondary)'
                          )}
                        >
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
                    {item.marks && item.marks.length > 0 && <PlanMarks ids={item.marks} />}
                    <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
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
                            className="a11y-focus-ring rounded-xs text-(--accent) underline underline-offset-2 transition hover:opacity-80"
                          >
                            {item.link.label ?? 'link'}
                          </a>
                        </>
                      )}
                    </p>
                    {((item.pros && item.pros.length > 0) ||
                      (item.cons && item.cons.length > 0)) && (
                      // Grid gaps, not space-y: the unlayered .tradeoff-list margin reset
                      // beats Tailwind's layered margin utilities.
                      <div className="mt-3 grid gap-1 text-xs leading-relaxed text-(--text-secondary)">
                        {item.pros && item.pros.length > 0 && (
                          <ul
                            aria-label="Pros"
                            className="tradeoff-list tradeoff-list-pro grid gap-1"
                          >
                            {item.pros.map((pro) => (
                              <li key={pro}>{pro}</li>
                            ))}
                          </ul>
                        )}
                        {item.cons && item.cons.length > 0 && (
                          <ul
                            aria-label="Cons"
                            className="tradeoff-list tradeoff-list-con grid gap-1"
                          >
                            {item.cons.map((con) => (
                              <li key={con}>{con}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
