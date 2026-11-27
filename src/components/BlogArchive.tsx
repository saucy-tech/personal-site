'use client';

import {
  BookOpenIcon,
  FunnelIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import { cn, formatPostDate } from '@/utils/helpers';
import {
  POST_CATEGORIES,
  slugifyTag,
  type PostCategory,
  type PostMeta,
} from '@/utils/post-taxonomy';

type CategoryFilter = 'all' | PostCategory;

/** Uses the shared `--surface` token when defined, else a light/dark-safe foreground tint. */
const surface = 'bg-[var(--surface,color-mix(in_srgb,var(--foreground)_4%,transparent))]';

const inactivePillClass = cn(
  'border-(--surface-border) text-(--text-secondary) hover:border-(--accent-border) hover:text-(--text-primary)',
  surface
);

const chipClass = cn(
  'rounded-full border border-(--surface-border) px-3 py-1 text-xs text-(--text-secondary)',
  surface
);

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeTagSlug, setActiveTagSlug] = useState<string>('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const cat = searchParams.get('category');
    const tag = searchParams.get('tag');
    startTransition(() => {
      setQuery(q);
      if (cat && cat in POST_CATEGORIES) {
        setActiveCategory(cat as PostCategory);
      } else {
        setActiveCategory('all');
      }
      if (tag) {
        setActiveTagSlug(tag);
      } else {
        setActiveTagSlug('all');
      }
    });
    hydratedFromUrl.current = true;
  }, [searchParams]);

  const categoryScopedPosts =
    activeCategory === 'all' ? posts : posts.filter((post) => post.category === activeCategory);

  const visibleTags = useMemo(
    () =>
      Array.from(
        categoryScopedPosts.reduce((tagMap, post) => {
          post.tags.forEach((tag) => {
            tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
          });

          return tagMap;
        }, new Map<string, number>())
      )
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 8)
        .map(([tag]) => ({ label: tag, slug: slugifyTag(tag) })),
    [categoryScopedPosts]
  );

  const filteredPosts = categoryScopedPosts.filter((post) => {
    const matchesTag =
      activeTagSlug === 'all' || post.tags.some((tag) => slugifyTag(tag) === activeTagSlug);
    return matchesTag && matchesQuery(post, deferredQuery);
  });

  useEffect(() => {
    if (!hydratedFromUrl.current) {
      return;
    }
    const nextParams = new URLSearchParams();
    if (activeCategory !== 'all') {
      nextParams.set('category', activeCategory);
    }
    if (activeTagSlug !== 'all') {
      nextParams.set('tag', activeTagSlug);
    }
    if (query.trim()) {
      nextParams.set('q', query.trim());
    }
    const nextQs = nextParams.toString();
    const currentQs = searchParams.toString();
    if (nextQs === currentQs) {
      return;
    }
    router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, { scroll: false });
  }, [activeCategory, activeTagSlug, query, pathname, router, searchParams]);

  return (
    <div className="space-y-6">
      <div className={cn('rounded-3xl border border-(--accent-border) p-4 sm:p-6', surface)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
            <FunnelIcon className="h-4 w-4 text-(--accent)" />
            Browse by type, topic, or scripture passage.
          </div>

          <label htmlFor="blog-search" className="relative block">
            <span className="sr-only">Search posts</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-secondary)" />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, excerpts, tags, or series"
              className="w-full rounded-2xl border border-(--surface-border) bg-(--background) py-3 pl-10 pr-4 text-sm text-(--text-primary) outline-hidden transition focus:border-(--accent) focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.22)]"
            />
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTagSlug('all');
              }}
              aria-pressed={activeCategory === 'all'}
              className={cn(
                'a11y-focus-ring rounded-full border px-4 py-2 text-sm transition',
                activeCategory === 'all'
                  ? 'border-(--accent) bg-(--accent-transparent) text-(--text-primary)'
                  : inactivePillClass
              )}
            >
              All Posts
              <span className="ml-2 text-(--accent)">{posts.length}</span>
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
                    setActiveTagSlug('all');
                  }}
                  aria-pressed={isActive}
                  className={cn(
                    'a11y-focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                    isActive
                      ? 'border-(--accent) bg-(--accent-transparent) text-(--text-primary)'
                      : inactivePillClass
                  )}
                >
                  <CategoryIcon category={categoryKey} className="h-4 w-4" />
                  {details.label}
                  <span className="text-(--accent)">{getCategoryCount(posts, categoryKey)}</span>
                </button>
              );
            })}
          </div>

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
              <button
                type="button"
                onClick={() => setActiveTagSlug('all')}
                aria-pressed={activeTagSlug === 'all'}
                className={cn(
                  'a11y-focus-ring rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition',
                  activeTagSlug === 'all'
                    ? 'border-(--accent) bg-(--accent-transparent) text-(--text-primary)'
                    : inactivePillClass
                )}
              >
                All Topics
              </button>

              {visibleTags.map(({ label, slug }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setActiveTagSlug(slug)}
                  aria-pressed={activeTagSlug === slug}
                  className={cn(
                    'a11y-focus-ring rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition',
                    activeTagSlug === slug
                      ? 'border-(--accent) bg-(--accent-transparent) text-(--text-primary)'
                      : inactivePillClass
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-(--text-secondary)">
        <p>
          Showing <span className="text-(--text-primary)">{filteredPosts.length}</span> of{' '}
          <span className="text-(--text-primary)">{posts.length}</span> posts
        </p>
        {(activeCategory !== 'all' || activeTagSlug !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setActiveTagSlug('all');
              setQuery('');
              router.replace(pathname, { scroll: false });
            }}
            className="a11y-focus-ring rounded-xs text-(--accent) transition hover:text-(--text-primary)"
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
              className={cn(
                'a11y-focus-ring group flex h-full flex-col rounded-3xl border border-(--accent-border) p-5 transition hover:border-(--accent) hover:bg-(--accent-transparent) hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]',
                surface
              )}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-(--accent)">
                <CategoryIcon category={post.category} className="h-4 w-4" />
                <span>{post.categoryLabel}</span>
                <span className="text-(--text-secondary)">•</span>
                <span className="text-(--text-secondary)">{formatPostDate(post.date)}</span>
              </div>

              <h3 className="mt-4 text-xl font-semibold leading-tight text-(--text-primary) transition group-hover:text-(--accent)">
                {post.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-(--text-secondary)">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.series && <span className={chipClass}>{post.series}</span>}
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={chipClass}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 text-sm font-medium text-(--accent) transition group-hover:text-(--text-primary)">
                Read article →
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'rounded-3xl border border-dashed border-(--accent-border) p-8 text-center',
            surface
          )}
        >
          <p className="text-lg font-medium text-(--text-primary)">No posts match that filter.</p>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Try a broader category, clear the topic filter, or search a different keyword.
          </p>
        </div>
      )}
    </div>
  );
}
