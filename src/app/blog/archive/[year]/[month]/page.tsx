import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import { formatPostDate } from '@/utils/helpers';
import { getAllYearMonthArchiveParams, getPostsByYearMonth } from '@/utils/posts';

export async function generateStaticParams() {
  return getAllYearMonthArchiveParams().map(({ year, month }) => ({ year, month }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ year: string; month: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month } = await params;
  const y = Number(year);
  const m = Number(month);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
    return { title: 'Archive' };
  }
  const title = `Archive — ${year}-${month}`;
  return {
    title,
    description: `All posts published in ${year}-${month}.`,
    alternates: {
      canonical: `/blog/archive/${year}/${month}`,
    },
    openGraph: {
      title,
      url: `/blog/archive/${year}/${month}`,
    },
  };
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { year, month } = await params;
  const y = Number(year);
  const m = Number(month);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
    notFound();
  }
  const posts = getPostsByYearMonth(y, m);
  if (posts.length === 0) {
    notFound();
  }

  return (
    <PageLayout title={`${year} · ${month}`} backHref="/blog" backLabel="Back to Blog">
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        {posts.length} post{posts.length === 1 ? '' : 's'} this month.
      </p>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="a11y-focus-ring block rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)]"
            >
              <span className="text-xs text-[var(--text-secondary)]">
                {formatPostDate(post.date)}
              </span>
              <span className="mt-1 block font-semibold text-[var(--text-primary)]">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
