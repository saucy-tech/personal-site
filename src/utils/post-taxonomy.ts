export const POST_CATEGORIES = {
  'daily-word': {
    label: 'Daily Word',
    description: 'Short weekday scripture reflections and devotional notes.',
    href: '/daily-word',
  },
  'biblical-reflection': {
    label: 'Biblical Reflection',
    description: 'Longer Bible studies, Sunday school reflections, and teaching notes.',
  },
  'essays-ideas': {
    label: 'Essays & Ideas',
    description: 'Writing on creativity, technology, habits, and life.',
  },
} as const;

export type PostCategory = keyof typeof POST_CATEGORIES;

export interface PostMeta {
  slug: string;
  title: string;
  cardTitle?: string;
  date: string;
  excerpt: string;
  category: PostCategory;
  categoryLabel: string;
  categoryDescription: string;
  series?: string;
  tags: string[];
  readingTimeMinutes: number;
  audio?: string;
}

export interface PostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post extends PostMeta {
  content: string;
  /** Post body pre-compiled to HTML at build time (see scripts/generate-posts-data.ts). */
  html: string;
  headings: PostHeading[];
}

export const CATEGORY_ALIASES: Record<string, PostCategory> = {
  'daily-word': 'daily-word',
  dailyword: 'daily-word',
  'daily word': 'daily-word',
  devotion: 'daily-word',
  devotional: 'daily-word',
  'biblical-reflection': 'biblical-reflection',
  biblicalreflection: 'biblical-reflection',
  'biblical reflection': 'biblical-reflection',
  reflection: 'biblical-reflection',
  'essays-ideas': 'essays-ideas',
  essaysideas: 'essays-ideas',
  'essays & ideas': 'essays-ideas',
  essays: 'essays-ideas',
  essay: 'essays-ideas',
  ideas: 'essays-ideas',
};

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function getPostCategoryDetails(category: PostCategory) {
  return POST_CATEGORIES[category];
}

export function normalizePostCategory(value: unknown): PostCategory {
  const normalized = normalizeText(value)?.toLowerCase();
  if (!normalized) {
    return 'essays-ideas';
  }

  return CATEGORY_ALIASES[normalized] ?? 'essays-ideas';
}

/** URL-safe slug for a tag (used in `/blog/tag/[tag]` and archive filters). */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizePostTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return uniqueStrings(
      value.map((tag) => normalizeText(tag)).filter((tag): tag is string => Boolean(tag))
    );
  }

  const normalized = normalizeText(value);
  if (!normalized) {
    return [];
  }

  return uniqueStrings(
    normalized
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  );
}

export function normalizePostSeries(value: unknown): string | undefined {
  return normalizeText(value);
}

export function normalizeCardTitle(data: Record<string, unknown>): string | undefined {
  return normalizeText(data.shortTitle) ?? normalizeText(data.cardTitle);
}

export function toPostMeta(
  slug: string,
  data: Record<string, unknown>,
  readingTimeMinutes: number
): PostMeta {
  const category = normalizePostCategory(data.category);
  const categoryDetails = getPostCategoryDetails(category);

  return {
    slug,
    title: normalizeText(data.title) ?? slug,
    cardTitle: normalizeCardTitle(data),
    date: normalizeText(data.date) ?? '',
    excerpt: normalizeText(data.excerpt) ?? '',
    category,
    categoryLabel: categoryDetails.label,
    categoryDescription: categoryDetails.description,
    series: normalizePostSeries(data.series),
    tags: normalizePostTags(data.tags),
    readingTimeMinutes,
    audio: normalizeText(data.audio),
  };
}
