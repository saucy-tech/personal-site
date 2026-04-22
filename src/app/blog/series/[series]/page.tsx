import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import { formatPostDate } from '@/utils/helpers';
import { getAllSeries, getSeriesBySlug, isoWeekKey } from '@/utils/posts';
import type { PostMeta } from '@/utils/post-taxonomy';

function isoWeekYear(key: string): number {
  return Number(key.split('-W')[0]);
}

interface WeekGroup {
  key: string; // e.g. "2026-W13"
  weekNum: number; // 1-based position within this series
  year: number;
  posts: PostMeta[];
}

function groupByWeek(posts: PostMeta[]): WeekGroup[] {
  const map = new Map<string, PostMeta[]>();
  for (const post of posts) {
    const key = isoWeekKey(post.date);
    const bucket = map.get(key) ?? [];
    bucket.push(post);
    map.set(key, bucket);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, weekPosts], i) => ({
      key,
      weekNum: i + 1,
      year: isoWeekYear(key),
      posts: weekPosts,
    }));
}

function weekDateRange(posts: PostMeta[]): string {
  const first = posts[0]?.date;
  const last = posts[posts.length - 1]?.date;
  if (!first) return '';
  if (!last || first === last) return formatPostDate(first);
  return `${formatPostDate(first)} – ${formatPostDate(last)}`;
}

export async function generateStaticParams() {
  return getAllSeries().flatMap((series) => [
    { series: series.slug },
    ...series.aliases.map((alias) => ({ series: alias })),
  ]);
}

export const dynamicParams = false;

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  if (!series) notFound();

  return {
    title: `${series.name} — Series`,
    description: `All ${series.count} posts in the "${series.name}" series.`,
    alternates: {
      canonical: `/blog/series/${series.slug}`,
    },
    openGraph: {
      url: `/blog/series/${series.slug}`,
    },
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  if (!series) notFound();

  const weeks = groupByWeek(series.posts);

  // Pre-compute each week's starting post number (1-based, sequential across weeks)
  const weeksWithStartNum = weeks.map((week, wi) => ({
    ...week,
    startNum: weeks.slice(0, wi).reduce((sum, w) => sum + w.posts.length, 0),
  }));

  const firstDate = series.posts[0]?.date;
  const lastDate = series.posts[series.posts.length - 1]?.date;
  const dateRange =
    firstDate && lastDate && firstDate !== lastDate
      ? `${formatPostDate(firstDate)} – ${formatPostDate(lastDate)}`
      : firstDate
        ? formatPostDate(firstDate)
        : null;

  return (
    <PageLayout title={series.name} backHref="/blog/series" backLabel="All Series">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Series header */}
        <section className="overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[radial-gradient(circle_at_top_right,rgb(var(--accent-rgb)/0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Series</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{series.name}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
              {weeks.length} {weeks.length === 1 ? 'week' : 'weeks'}
            </span>
            <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
              {series.count} {series.count === 1 ? 'post' : 'posts'}
            </span>
            {dateRange && (
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                {dateRange}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Posts are listed oldest first so you can follow the series in order.
          </p>
        </section>

        {/* Weeks */}
        <div className="space-y-8">
          {weeksWithStartNum.map((week) => (
            <div key={week.key}>
              {/* Week header */}
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Week {week.weekNum}
                </h2>
                <span className="text-xs text-[var(--text-secondary)]">
                  {weekDateRange(week.posts)}
                </span>
                <span className="text-xs text-[var(--text-secondary)] opacity-60">{week.year}</span>
              </div>

              {/* Posts in this week */}
              <div className="space-y-3">
                {week.posts.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)] sm:p-6"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] text-xs font-semibold text-[var(--accent)]">
                      {week.startNum + i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                        {formatPostDate(post.date)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
