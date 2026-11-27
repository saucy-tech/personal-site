import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import { siteOpenGraph } from '@/utils/open-graph';
import { cn, formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';

/** Uses the shared `--surface` token when defined, else a light/dark-safe foreground tint. */
const surface = 'bg-[var(--surface,color-mix(in_srgb,var(--foreground)_4%,transparent))]';

const chipClass = cn(
  'rounded-full border border-(--surface-border) px-2.5 py-0.5 text-xs text-(--text-secondary)',
  surface
);

export const metadata: Metadata = {
  title: 'The Daily Word',
  description: "Archive of weekday scripture reflections from Brandon's Sunday School series.",
  alternates: {
    canonical: '/daily-word',
  },
  openGraph: siteOpenGraph({
    title: 'The Daily Word',
    description: "Archive of weekday scripture reflections from Brandon's Sunday School series.",
    url: '/daily-word',
  }),
};

export default function DailyWordPage() {
  const allPosts = getAllPostsMeta();
  const posts = allPosts.filter((post) => post.category === 'daily-word');
  const currentSeries = posts[0]?.series;

  return (
    <PageLayout title="The Daily Word" backHref="/" backLabel="Back to Home">
      {/* Hero */}
      <section className={cn('rounded-4xl border border-(--accent-border) p-6 sm:p-8', surface)}>
        <p className="text-sm uppercase tracking-[0.22em] text-(--accent)">Archive</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-(--text-primary) sm:text-4xl">
          The Daily Word
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--text-secondary)">
          A weekday scripture reflection series rooted in the Sunday School lessons. Each post is a
          2-minute read. This archive runs through May 2026. New entries now publish at The Morning
          Portion.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://morningportion.com"
            target="_blank"
            rel="noopener noreferrer"
            className="a11y-focus-ring rounded-full bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--on-accent) transition hover:brightness-110"
          >
            Read new entries at morningportion.com →
          </a>
        </div>

        {currentSeries && (
          <div className="mt-5">
            <span className="inline-block rounded-2xl border border-(--accent-border) bg-(--accent-transparent) px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-(--accent)">
              Final Series on Archive: {currentSeries}
            </span>
          </div>
        )}
      </section>

      {/* Post list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-[0.22em] text-(--text-secondary)">
            All Posts — {posts.length} total
          </h3>
        </div>

        <div className="grid gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={cn(
                'a11y-focus-ring group rounded-2xl border border-(--accent-border) p-5 transition hover:border-(--accent) hover:bg-(--accent-transparent)',
                surface
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-(--text-secondary)">{formatPostDate(post.date)}</span>
                {post.series && <span className={chipClass}>{post.series}</span>}
              </div>
              <h4 className="mt-2 text-base font-semibold leading-snug text-(--text-primary) transition group-hover:text-(--accent)">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="mt-1.5 text-sm leading-relaxed text-(--text-secondary) line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
