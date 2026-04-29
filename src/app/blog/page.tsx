import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import BlogArchive from '@/components/BlogArchive';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';
import { POST_CATEGORIES } from '@/utils/post-taxonomy';

export const metadata: Metadata = {
  title: 'Articles & Reflections',
  description: 'Daily Word posts, biblical reflections, and essays.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    url: '/blog',
  },
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const latest = posts[0];
  const seriesCount = new Set(posts.map((post) => post.series).filter(Boolean)).size;
  const categoryCards = Object.entries(POST_CATEGORIES).map(([category, details]) => {
    const categoryPosts = posts.filter((post) => post.category === category);

    return {
      key: category,
      label: details.label,
      description: details.description,
      href: 'href' in details ? details.href : undefined,
      count: categoryPosts.length,
      latest: categoryPosts[0],
    };
  });

  const statCards = [
    { label: 'Posts', value: posts.length },
    { label: 'Series', value: seriesCount },
    { label: 'Categories', value: Object.keys(POST_CATEGORIES).length },
  ];

  return (
    <PageLayout title="Articles & Reflections" backHref="/" backLabel="Back to Home">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="rounded-4xl border border-(--accent-border) bg-white/3 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-(--accent)">Writing Library</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-(--text-primary) sm:text-4xl">
            Biblical reflections, daily devotions, and essays with room to browse.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--text-secondary)">
            Search by topic, filter by category, or jump into the newest post without digging
            through an archive.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#library"
              className="a11y-focus-ring rounded-full bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--on-accent) transition hover:brightness-110"
            >
              Browse the library
            </a>
            <a
              href="#daily-word"
              className="a11y-focus-ring rounded-full border border-(--accent-border) px-5 py-2.5 text-sm font-medium text-(--text-primary) transition hover:border-(--accent) hover:bg-(--accent-transparent)"
            >
              Subscribe to The Daily Word
            </a>
          </div>
        </div>

        {latest && (
          <section className="rounded-4xl border border-(--accent-border) bg-[radial-gradient(circle_at_top_right,rgb(var(--accent-rgb)/0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-(--accent)">Latest Post</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-(--accent-border) bg-(--accent-transparent) px-3 py-1 text-xs uppercase tracking-[0.18em] text-(--accent)">
                {latest.categoryLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                {formatPostDate(latest.date)}
              </span>
              {latest.series && (
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                  {latest.series}
                </span>
              )}
            </div>

            <h3 className="mt-5 text-2xl font-semibold leading-tight text-(--text-primary)">
              {latest.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-(--text-secondary)">{latest.excerpt}</p>

            <Link
              href={`/blog/${latest.slug}`}
              className="a11y-focus-ring mt-5 inline-flex rounded-xs text-sm font-medium text-(--accent) transition hover:text-(--text-primary)"
            >
              Read the latest article →
            </Link>
          </section>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-(--accent-border) bg-white/3 p-5"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-(--text-secondary)">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-(--text-primary)">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {categoryCards.map((category) => (
          <div
            key={category.key}
            className="rounded-4xl border border-(--accent-border) bg-white/3 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.18em] text-(--accent)">
                {category.label}
              </p>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-(--text-secondary)">
                {category.count} posts
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-(--text-secondary)">
              {category.description}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {category.href && (
                <Link
                  href={category.href}
                  className="a11y-focus-ring inline-flex rounded-xs text-sm font-medium text-(--accent) transition hover:text-(--text-primary)"
                >
                  Visit the Daily Word →
                </Link>
              )}
              {category.latest && (
                <Link
                  href={`/blog/${category.latest.slug}`}
                  className="a11y-focus-ring inline-flex rounded-xs text-sm font-medium text-(--accent) transition hover:text-(--text-primary)"
                >
                  Latest: {category.latest.title}
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      <div id="library">
        <Section title="Explore the Library" emoji="🗂️">
          <p className="text-sm leading-relaxed text-(--text-secondary)">
            Search by topic, filter by category, and browse recent writing without digging through a
            long archive.
          </p>
          <Suspense fallback={<p className="text-sm text-(--text-secondary)">Loading filters…</p>}>
            <BlogArchive posts={posts} />
          </Suspense>
        </Section>
      </div>

      <div id="daily-word">
        <Section title="The Daily Word" emoji="✉️">
          <p className="text-sm leading-relaxed text-(--text-secondary)">
            Subscribe to The Daily Word for free weekday scripture reflections, delivered to your
            inbox every weekday morning. Short, KJV-rooted reflections rooted in the Sunday School
            lesson series.
          </p>
          <SubscribeForm />
        </Section>
      </div>
    </PageLayout>
  );
}
