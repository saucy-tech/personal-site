import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import { Post, PostMeta, toPostMeta } from '@/utils/post-taxonomy';
import { frontmatterSchema } from '@/utils/frontmatter-schema';
import { absoluteUrl } from '@/utils/constants';

export interface SeriesMeta {
  name: string;
  slug: string;
  aliases: string[];
  posts: PostMeta[];
  count: number;
  weekCount: number;
}

interface PostQueryOptions {
  includeFuture?: boolean;
}

export function seriesSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const SERIES_SLUG_ALIASES: Record<string, string[]> = {
  'Nicodemus Series': ['nicodemus'],
  'Woman at the Well Series': ['woman-at-the-well'],
  'The Paralytic in Mark 2 Series': ['the-paralytic-in-mark-2'],
  'Sent Like Witnesses Series': ['sent-like-witnesses'],
  'He Has Risen Series': ['he-is-risen-the-victory-that-changes-everything'],
};

// Returns a sortable ISO week key "YYYY-WNN" for a "YYYY-MM-DD" date string.
// Uses ISO 8601 (Mon–Sun weeks; week 1 contains the year's first Thursday).
export function isoWeekKey(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  const [year, month, day] = [parts[0] ?? 0, parts[1] ?? 1, parts[2] ?? 1];
  const d = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = d.getUTCDay() || 7; // 1=Mon … 7=Sun
  d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek); // shift to nearest Thursday
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function getAllSeries(): SeriesMeta[] {
  const posts = getAllPostsMeta();
  const seriesMap = new Map<string, PostMeta[]>();
  posts.forEach((p) => {
    if (p.series) {
      const existing = seriesMap.get(p.series) ?? [];
      existing.push(p);
      seriesMap.set(p.series, existing);
    }
  });
  return Array.from(seriesMap.entries()).map(([name, seriesPosts]) => {
    const sorted = seriesPosts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const weekCount = new Set(sorted.map((p) => isoWeekKey(p.date))).size;
    const slug = seriesSlug(name);
    return {
      name,
      slug,
      aliases: (SERIES_SLUG_ALIASES[name] ?? []).filter((alias) => alias !== slug),
      posts: sorted,
      count: sorted.length,
      weekCount,
    };
  });
}

export function getSeriesBySlug(slug: string): SeriesMeta | undefined {
  return getAllSeries().find((series) => series.slug === slug || series.aliases.includes(slug));
}

// Configure gray-matter to use js-yaml 4.x's load function
// @ts-expect-error - gray-matter's types don't include engines, but it exists at runtime
matter.engines.yaml = {
  parse: (str: string) => yaml.load(str) as Record<string, unknown>,
  stringify: (obj: Record<string, unknown>) => yaml.dump(obj),
};

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts');
const SITE_TIME_ZONE = 'America/New_York';
type ParsedPostEntry = {
  slug: string;
  meta: PostMeta;
  content: string;
};
type PostsCache = {
  signature: string;
  posts: ParsedPostEntry[];
};
let postsCache: PostsCache | null = null;

function ensurePostsDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}
function getPostPath(slug: string): string {
  return path.join(POSTS_DIR, `${slug}.mdx`);
}

export function getPostSlugs(): string[] {
  ensurePostsDir();
  return getParsedPosts().map((entry) => entry.slug);
}

function getPostsSignature(): string {
  ensurePostsDir();
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .sort();
  return files
    .map((file) => {
      const fullPath = path.join(POSTS_DIR, file);
      const stat = fs.statSync(fullPath);
      return `${file}:${stat.mtimeMs}`;
    })
    .join('|');
}

function getParsedPosts(): ParsedPostEntry[] {
  const signature = getPostsSignature();
  if (postsCache && postsCache.signature === signature) {
    return postsCache.posts;
  }

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      const fileContent = fs.readFileSync(getPostPath(slug), 'utf-8');
      const { data, content } = matter(fileContent);
      const result = frontmatterSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues
          .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
          .join('\n');
        throw new Error(`Frontmatter validation failed for "${slug}.mdx":\n${issues}`);
      }

      return {
        slug,
        meta: toPostMeta(slug, data),
        content,
      };
    });

  postsCache = { signature, posts };
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

// Note: We will send raw MDX to the page and compile there with next-mdx-remote/rsc
export async function getPostBySlug(
  slug: string,
  options: PostQueryOptions = {}
): Promise<Post | null> {
  const { includeFuture = false } = options;
  const parsedPost = getParsedPosts().find((entry) => entry.slug === slug);
  if (!parsedPost) {
    return null;
  }
  const post = { ...parsedPost.meta, content: parsedPost.content };

  if (!includeFuture && !isPublishedDate(post.date)) {
    return null;
  }

  return post;
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
