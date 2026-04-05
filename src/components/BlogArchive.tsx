'use client';

import {
  BookOpenIcon,
  FunnelIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useDeferredValue, useState } from 'react';

import { cn, formatPostDate } from '@/utils/helpers';
import { POST_CATEGORIES, type PostCategory, type PostMeta } from '@/utils/post-taxonomy';

type CategoryFilter = 'all' | PostCategory;

interface BlogArchiveProps {
  posts: PostMeta[];
}

function CategoryIcon({ category, className }: { category: PostCategory; className?: string }) {
  switch (category) {
    case 'daily-word':
      return <SparklesIcon className={className} />;
    case 'biblical-reflection':
      return <BookOpenIcon className={className} />;
    case 'essays-ideas':
      return <LightBulbIcon className={className} />;
  }
}

function getCategoryCount(posts: PostMeta[], category: PostCategory) {
  return posts.filter((post) => post.category === category).length;
}

function matchesQuery(post: PostMeta, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    post.title,
    post.cardTitle,
    post.excerpt,
    post.categoryLabel,
    post.series,
    ...post.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export default function BlogArchive({ posts }: BlogArchiveProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const categoryScopedPosts =
    activeCategory === 'all' ? posts : posts.filter((post) => post.category === activeCategory);

  const visibleTags = Array.from(
    categoryScopedPosts.reduce((tagMap, post) => {
      post.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      });

      return tagMap;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([tag]) => tag);

  const filteredPosts = categoryScopedPosts.filter((post) => {
    const matchesTag = activeTag === 'all' || post.tags.includes(activeTag);
    return matchesTag && matchesQuery(post, deferredQuery);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[var(--accent-border)] bg-white/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <FunnelIcon className="h-4 w-4 text-[var(--accent)]" />
            Browse by type, topic, or scripture passage.
          </div>

          <label className="relative block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, excerpts, tags, or series"
              className="w-full rounded-2xl border border-white/10 bg-black/10 py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,175,55,0.2)]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTag('all');
              }}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition',
                activeCategory === 'all'
                  ? 'border-[var(--accent)] bg-[var(--accent-transparent)] text-[var(--text-primary)]'
                  : 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text-primary)]'
              )}
            >
              All Posts
              <span className="ml-2 text-[var(--accent)]">{posts.length}</span>
            </button>

            {Object.entries(POST_CATEGORIES).map(([category, details]) => {
              const categoryKey = category as PostCategory;
              const isActive = activeCategory === categoryKey;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(categoryKey);
                    setActiveTag('all');
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent-transparent)] text-[var(--text-primary)]'
                      : 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <CategoryIcon category={categoryKey} className="h-4 w-4" />
                  {details.label}
                  <span className="text-[var(--accent)]">
                    {getCategoryCount(posts, categoryKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag('all')}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition',
                  activeTag === 'all'
                    ? 'border-[var(--accent)] bg-[var(--accent-transparent)] text-[var(--text-primary)]'
                    : 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text-primary)]'
                )}
              >
                All Topics
              </button>

              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition',
                    activeTag === tag
                      ? 'border-[var(--accent)] bg-[var(--accent-transparent)] text-[var(--text-primary)]'
                      : 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
        <p>
          Showing <span className="text-[var(--text-primary)]">{filteredPosts.length}</span> of{' '}
          <span className="text-[var(--text-primary)]">{posts.length}</span> posts
        </p>
        {(activeCategory !== 'all' || activeTag !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setActiveTag('all');
              setQuery('');
            }}
            className="text-[var(--accent)] transition hover:text-[var(--text-primary)]"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-3xl border border-[var(--accent-border)] bg-white/[0.03] p-5 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                <CategoryIcon category={post.category} className="h-4 w-4" />
                <span>{post.categoryLabel}</span>
                <span className="text-[var(--text-secondary)]">•</span>
                <span className="text-[var(--text-secondary)]">{formatPostDate(post.date)}</span>
              </div>

              <h3 className="mt-4 text-xl font-semibold leading-tight text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                {post.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {post.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.series && (
                  <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {post.series}
                  </span>
                )}
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 text-sm font-medium text-[var(--accent)] transition group-hover:text-[var(--text-primary)]">
                Read article →
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--accent-border)] bg-white/[0.02] p-8 text-center">
          <p className="text-lg font-medium text-[var(--text-primary)]">
            No posts match that filter.
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Try a broader category, clear the topic filter, or search a different keyword.
          </p>
        </div>
      )}
    </div>
  );
}
