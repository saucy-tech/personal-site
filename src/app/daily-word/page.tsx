import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';

export const metadata: Metadata = {
  title: 'The Daily Word',
  description:
    "Free weekday scripture reflections and notes from Brandon's Sunday School series. Subscribe to get each post by email.",
  alternates: {
    canonical: '/daily-word',
  },
  openGraph: {
    title: 'The Daily Word',
    description:
      "Free weekday scripture reflections and notes from Brandon's Sunday School series. Subscribe to get each post by email.",
    url: '/daily-word',
  },
};

export default function DailyWordPage() {
  const allPosts = getAllPostsMeta();
  const posts = allPosts.filter((post) => post.category === 'daily-word');
  const currentSeries = posts[0]?.series;

  return (
    <PageLayout title="The Daily Word" backHref="/" backLabel="Back to Home">
      {/* Hero + Subscribe */}
      <section className="rounded-4xl border border-(--accent-border) bg-white/3 p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.22em] text-(--accent)">Free Weekday Email</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-(--text-primary) sm:text-4xl">
          The Daily Word
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--text-secondary)">
          The Daily Word is a free, weekday scripture reflection delivered straight to your inbox.
          Each post is a 2-minute read rooted in the Sunday School lesson series — designed to start
          your day in the Word.
        </p>

        {currentSeries && (
          <div className="mt-5">
            <span className="inline-block rounded-2xl border border-(--accent-border) bg-(--accent-transparent) px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-(--accent)">
              Current Series: {currentSeries}
            </span>
          </div>
        )}

        <div className="mt-6 max-w-md">
          <SubscribeForm />
        </div>
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
              className="group rounded-2xl border border-(--accent-border) bg-white/3 p-5 transition hover:border-(--accent) hover:bg-(--accent-transparent)"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-(--text-secondary)">{formatPostDate(post.date)}</span>
                {post.series && (
                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-0.5 text-xs text-(--text-secondary)">
                    {post.series}
                  </span>
                )}
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
