import Link from 'next/link';

import BlogArchive from '@/components/BlogArchive';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';
import { POST_CATEGORIES } from '@/utils/post-taxonomy';

export const metadata = {
  title: 'Articles & Reflections',
  description: 'Daily Word posts, biblical reflections, and essays.',
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const latest = posts[0];
  const seriesCount = new Set(posts.map((post) => post.series).filter(Boolean)).size;

  const statCards = [
    { label: 'Posts', value: posts.length },
    { label: 'Series', value: seriesCount },
    { label: 'Categories', value: Object.keys(POST_CATEGORIES).length },
  ];

  return (
    <PageLayout title="Articles & Reflections" backHref="/" backLabel="Back to Home">
      {latest && (
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                {latest.categoryLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                {formatDate(new Date(latest.date))}
              </span>
              {latest.series && (
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {latest.series}
                </span>
              )}
            </div>

            <h2 className="mt-5 text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl">
              Latest: {latest.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              {latest.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/blog/${latest.slug}`}
                className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
              >
                Read the latest article
              </Link>
              <a
                href="#daily-word"
                className="rounded-full border border-[var(--accent-border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)]"
              >
                Subscribe to The Daily Word
              </a>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[var(--accent-border)] bg-white/[0.03] p-5"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <Section title="Blog" emoji="🗂️">
        <BlogArchive posts={posts} />
      </Section>

      <div id="daily-word">
        <Section title="The Daily Word" emoji="✉️">
          <p className="text-sm text-gray-400 mb-4">
            Short weekday reflections from Scripture, plus longer biblical reflections when a Sunday
            school lesson deserves more room. Free.
          </p>
          <SubscribeForm />
        </Section>
      </div>
    </PageLayout>
  );
}
