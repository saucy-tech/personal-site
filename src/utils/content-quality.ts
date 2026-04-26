export interface PostQualityInput {
  title: string;
  excerpt: string;
  tags: string[];
}

export interface PostQualityResult {
  errors: string[];
  warnings: string[];
}

const TITLE_MIN_LENGTH = 20;
const TITLE_MAX_LENGTH = 72;
const EXCERPT_MIN_LENGTH = 90;
const EXCERPT_MAX_LENGTH = 180;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function evaluatePostContentQuality(input: PostQualityInput): PostQualityResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const title = normalizeWhitespace(input.title);
  const excerpt = normalizeWhitespace(input.excerpt);

  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    warnings.push(
      `title length (${title.length}) must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`
    );
  }

  if (excerpt.length < EXCERPT_MIN_LENGTH || excerpt.length > EXCERPT_MAX_LENGTH) {
    warnings.push(
      `excerpt length (${excerpt.length}) must be between ${EXCERPT_MIN_LENGTH} and ${EXCERPT_MAX_LENGTH} characters`
    );
  }

  if (input.tags.length === 0) {
    warnings.push('missing tags: add at least one tag for better discovery');
  }

  const seenTags = new Set<string>();
  for (const rawTag of input.tags) {
    const normalizedTag = normalizeWhitespace(rawTag).toLowerCase();
    if (!normalizedTag) {
      continue;
    }
    if (seenTags.has(normalizedTag)) {
      warnings.push('duplicate tags: remove repeated tag values');
      break;
    }
    seenTags.add(normalizedTag);
  }

  return { errors, warnings };
}
