import type { Metadata } from 'next';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

import { POST_HTML, RAW_POSTS } from '@/utils/posts-data.generated';

import { Post, PostHeading, PostMeta, toPostMeta } from '@/utils/post-taxonomy';
import { frontmatterSchema } from '@/utils/frontmatter-schema';
import { absoluteUrl } from '@/utils/constants';

interface PostQueryOptions {
  includeFuture?: boolean;
}

// Configure gray-matter to use js-yaml 5.x's load function
// @ts-expect-error - gray-matter's types don't include engines, but it exists at runtime
matter.engines.yaml = {
  parse: (str: string) => yamlLoad(str) as Record<string, unknown>,
  stringify: (obj: Record<string, unknown>) => yamlDump(obj),
};

const SITE_TIME_ZONE = 'America/New_York';
type ParsedPostEntry = {
  slug: string;
  meta: PostMeta;
  content: string;
  headings: PostHeading[];
};
// RAW_POSTS is bundled at build time and never changes within a running
// process, so a single parse is memoized for the lifetime of the module.
let postsCache: ParsedPostEntry[] | null = null;
const WORDS_PER_MINUTE = 200;

function stripMdxFrontmatter(value: string): string {
  return value.replace(/^---[\s\S]*?---\s*/, '');
}

function stripMdxCodeFences(value: string): string {
  return value.replace(/```[\s\S]*?```/g, ' ');
}

function normalizeHeadingText(value: string): string {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractPostHeadings(content: string): PostHeading[] {
  const withoutFrontmatter = stripMdxFrontmatter(content);
  const withoutCodeBlocks = stripMdxCodeFences(withoutFrontmatter);
  const lines = withoutCodeBlocks.split('\n');
  const headings: PostHeading[] = [];
  const slugger = new GithubSlugger();

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const level = match[1]!.length as 2 | 3;
    const text = normalizeHeadingText(match[2]!);
    if (!text) {
      continue;
    }

    headings.push({
      id: slugger.slug(text),
      text,
      level,
    });
  }

  return headings;
}

/** Same-series neighbors in chronological reading order (oldest → newest). */
export function getSeriesChronoNeighbors(post: Pick<PostMeta, 'slug' | 'series' | 'date'>): {
  previous: PostMeta | null;
  next: PostMeta | null;
} {
  if (!post.series) {
    return { previous: null, next: null };
  }
  const inSeries = getAllPostsMeta()
    .filter((p) => p.series === post.series)
    .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  const idx = inSeries.findIndex((p) => p.slug === post.slug);
  if (idx === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: inSeries[idx - 1] ?? null,
    next: inSeries[idx + 1] ?? null,
  };
}

export function getReadingTimeFromContent(content: string): number {
  const plainText = stripMdxCodeFences(stripMdxFrontmatter(content))
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~[\](){}|\\/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function getParsedPosts(): ParsedPostEntry[] {
  if (postsCache) {
    return postsCache;
  }

  const posts = Object.keys(RAW_POSTS)
    .sort()
    .map((slug) => {
      const { data, content } = matter(RAW_POSTS[slug]!);
      const result = frontmatterSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues
          .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
          .join('\n');
        throw new Error(`Frontmatter validation failed for "${slug}.mdx":\n${issues}`);
      }

      const readingTimeMinutes = getReadingTimeFromContent(content);
      const headings = extractPostHeadings(content);

      return {
        slug,
        meta: toPostMeta(slug, result.data, readingTimeMinutes),
        content,
        headings,
      };
    });

  postsCache = posts;
  return posts;
}

function getTodayDateString(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function isPublishedDate(date: string): boolean {
  return !date || date <= getTodayDateString();
}

export function getAllPostsMeta(options: PostQueryOptions = {}): PostMeta[] {
  const { includeFuture = false } = options;

  return getParsedPosts()
    .map((entry) => entry.meta)
    .filter((post) => includeFuture || isPublishedDate(post.date))
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

// Note: the post body is compiled to HTML at build time (gen:posts) because
// Cloudflare Workers disallow the runtime code generation next-mdx-remote uses.
export async function getPostBySlug(
  slug: string,
  options: PostQueryOptions = {}
): Promise<Post | null> {
  const { includeFuture = false } = options;
  const parsedPost = getParsedPosts().find((entry) => entry.slug === slug);
  if (!parsedPost) {
    return null;
  }
  const post = {
    ...parsedPost.meta,
    content: parsedPost.content,
    html: POST_HTML[slug] ?? '',
    headings: parsedPost.headings,
  };

  if (!includeFuture && !isPublishedDate(post.date)) {
    return null;
  }

  return post;
}

export function getRelatedPosts(
  post: Pick<PostMeta, 'slug' | 'category' | 'tags'>,
  limit = 3
): PostMeta[] {
  const candidates = getAllPostsMeta().filter((candidate) => candidate.slug !== post.slug);
  const normalizedPostTags = new Set(post.tags.map((tag) => tag.toLowerCase()));

  const primaryMatches = candidates
    .map((candidate) => {
      const sharedTagCount = candidate.tags.reduce((count, tag) => {
        return normalizedPostTags.has(tag.toLowerCase()) ? count + 1 : count;
      }, 0);
      const sameCategory = candidate.category === post.category;
      const score = (sameCategory ? 2 : 0) + sharedTagCount * 3;

      return {
        candidate,
        score,
        sharedTagCount,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      if (a.sharedTagCount !== b.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      return b.candidate.date.localeCompare(a.candidate.date);
    })
    .map((item) => item.candidate);

  const related = [...primaryMatches];

  for (const candidate of candidates) {
    if (related.length >= limit) {
      break;
    }
    if (related.some((relatedPost) => relatedPost.slug === candidate.slug)) {
      continue;
    }
    related.push(candidate);
  }

  return related.slice(0, limit);
}

export function getPostOgImageUrl(slug: string): string {
  return absoluteUrl(`/blog/${slug}/opengraph-image`);
}

export async function getPostOgMeta(slug: string): Promise<Metadata | null> {
  const post = await getPostBySlug(slug);
  if (!post) {
    return null;
  }

  const { title, excerpt } = post;
  const imageUrl = getPostOgImageUrl(slug);
  const url = absoluteUrl(`/blog/${slug}`);

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      url,
      publishedTime: post.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: [imageUrl],
    },
  };
}
