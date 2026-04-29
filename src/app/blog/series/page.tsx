import Link from 'next/link';
import type { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { formatPostDate } from '@/utils/helpers';
import { getAllSeries } from '@/utils/posts';

export const metadata: Metadata = {
  title: 'Blog Series',
  description: "Browse all multi-part series from Brandon's blog, organized by topic.",
  alternates: {
    canonical: '/blog/series',
  },
  openGraph: {
    url: '/blog/series',
  },
};

export default function SeriesIndexPage() {
  const allSeries = getAllSeries();

  return (
    <PageLayout title="Series" backHref="/blog" backLabel="Back to Blog">
      <div className="mx-auto max-w-3xl space-y-10">
        <p className="text-lg leading-relaxed text-(--text-secondary)">
          These posts are organized into series that follow a sustained study or theme — typically
          aligned with Sunday School lesson quarters.
        </p>

        {allSeries.length === 0 ? (
          <p className="text-(--text-secondary)">No series found.</p>
        ) : (
          <div className="grid gap-6">
            {allSeries.map((series) => {
              const firstDate = series.posts[0]?.date;
              const lastDate = series.posts[series.posts.length - 1]?.date;
              const dateRange =
                firstDate && lastDate && firstDate !== lastDate
                  ? `${formatPostDate(firstDate)} – ${formatPostDate(lastDate)}`
                  : firstDate
                    ? formatPostDate(firstDate)
                    : null;

              return (
                <Link
                  key={series.slug}
                  href={`/blog/series/${series.slug}`}
                  className="group block overflow-hidden rounded-4xl border border-(--accent-border) bg-[radial-gradient(circle_at_top_right,rgb(var(--accent-rgb)/0.1),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6 transition hover:border-(--accent) hover:bg-(--accent-transparent) sm:p-8"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-(--accent)">Series</p>
                  <h2 className="mt-2 text-2xl font-semibold text-(--text-primary) transition group-hover:text-(--accent)">
                    {series.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                      {series.weekCount} {series.weekCount === 1 ? 'week' : 'weeks'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                      {series.count} {series.count === 1 ? 'post' : 'posts'}
                    </span>
                    {dateRange && (
                      <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                        {dateRange}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm font-medium text-(--accent) transition group-hover:text-(--text-primary)">
                    Browse series &rarr;
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
