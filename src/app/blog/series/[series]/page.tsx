import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import { formatPostDate } from '@/utils/helpers';
import { getAllSeries } from '@/utils/posts';

export async function generateStaticParams() {
  return getAllSeries().map((series) => ({ series: series.slug }));
}

export const dynamicParams = false;

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { series: seriesSlug } = await params;
  const allSeries = getAllSeries();
  const series = allSeries.find((s) => s.slug === seriesSlug);
  if (!series) {
    notFound();
  }

  return {
    title: `${series.name} — Series`,
    description: `All ${series.count} posts in the "${series.name}" series.`,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series: seriesSlug } = await params;
  const allSeries = getAllSeries();
  const series = allSeries.find((s) => s.slug === seriesSlug);
  if (!series) {
    notFound();
  }

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
        <section className="overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Series</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{series.name}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
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

        {/* Posts list */}
        <div className="space-y-4">
          {series.posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)] sm:p-6"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] text-xs font-semibold text-[var(--accent)]">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                  {formatPostDate(post.date)}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-snug text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                  {post.title}
                </h2>
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
    </PageLayout>
  );
}
