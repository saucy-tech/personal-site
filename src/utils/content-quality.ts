import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import { extractMarkdownImages, hasMeaningfulAltText, classifyImageSize } from './image-hygiene';
import {
  extractMarkdownLinkTargets,
  isExternalOrAnchorLink,
  normalizeLinkTarget,
  validateRelativeLinkUsage,
} from './link-hygiene';

export interface PostQualityInput {
  title: string;
  excerpt: string;
  tags: string[];
}

export interface PostQualityResult {
  errors: string[];
  warnings: string[];
}

export type AuditLevel = 'error' | 'warning';

export interface AuditFinding {
  level: AuditLevel;
  source: string;
  message: string;
}

export interface AuditReportHeaders {
  intro: string;
  warning: string;
  error: string;
  pass: string;
  fail: string;
}

export interface FormatAuditReportInput {
  checkedCount: number;
  checkedLabel: string;
  findings: AuditFinding[];
  headers: AuditReportHeaders;
}

export interface FormattedAuditReport {
  introLine: string;
  warningLines: string[];
  errorLines: string[];
  finalLine: string;
  findings: AuditFinding[];
}

export interface ContentValidationResult {
  postFiles: string[];
  findings: AuditFinding[];
}

export interface InternalLinksAuditOptions {
  rootDir?: string;
  orphanWarnAfterDays: number;
}

export interface ImageHygieneAuditOptions {
  rootDir?: string;
  warningThresholdBytes: number;
  errorThresholdBytes: number;
}

const TITLE_MIN_LENGTH = 20;
const TITLE_MAX_LENGTH = 72;
const EXCERPT_MIN_LENGTH = 90;
const EXCERPT_MAX_LENGTH = 180;

// @ts-expect-error gray-matter engines are runtime-configurable.
matter.engines.yaml = {
  parse: (value: string) => yaml.load(value) as Record<string, unknown>,
  stringify: (value: Record<string, unknown>) => yaml.dump(value),
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function getPostsDir(rootDir: string): string {
  return path.join(rootDir, 'src', 'posts');
}

function getPublicDir(rootDir: string): string {
  return path.join(rootDir, 'public');
}

function toSlug(fileName: string): string {
  return fileName.replace(/\.mdx?$/, '');
}

function getFindingSourceLabel(prefix: string, fileName: string): string {
  return `${prefix}/${fileName}`;
}

function parseTags(rawTags: unknown): string[] {
  if (Array.isArray(rawTags) && rawTags.every((tag) => typeof tag === 'string')) {
    return rawTags;
  }
  if (typeof rawTags === 'string') {
    return [rawTags];
  }
  return [];
}

export function collectPostFiles(rootDir: string): string[] {
  const postsDir = getPostsDir(rootDir);
  return fs
    .readdirSync(postsDir)
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

export function toExitCode(findings: AuditFinding[]): number {
  return findings.some((finding) => finding.level === 'error') ? 1 : 0;
}

export function formatAuditReport(input: FormatAuditReportInput): FormattedAuditReport {
  const warnings = input.findings.filter((finding) => finding.level === 'warning');
  const errors = input.findings.filter((finding) => finding.level === 'error');
  const warningLines =
    warnings.length > 0
      ? ['', `${input.headers.warning} (${warnings.length}):`, ...warnings.map(formatFinding)]
      : [];
  const errorLines =
    errors.length > 0
      ? ['', `${input.headers.error} (${errors.length}):`, ...errors.map(formatFinding)]
      : [];

  return {
    introLine: input.headers.intro,
    warningLines,
    errorLines,
    finalLine: errors.length > 0 ? input.headers.fail : input.headers.pass,
    findings: input.findings,
  };
}

export function emitAuditReport(report: FormattedAuditReport): void {
  console.log(report.introLine);
  for (const line of report.warningLines) {
    console.warn(line);
  }
  for (const line of report.errorLines) {
    console.error(line);
  }
  if (report.finalLine) {
    if (toExitCode(report.findings) > 0) {
      console.error(`\n${report.finalLine}`);
    } else {
      console.log(`\n${report.finalLine}`);
    }
  }
}

function formatFinding(finding: AuditFinding): string {
  return `- [${finding.source}] ${finding.message}`;
}

export function runContentValidationAudit(rootDir = process.cwd()): ContentValidationResult {
  const postsDir = getPostsDir(rootDir);
  const postFiles = collectPostFiles(rootDir);
  const findings: AuditFinding[] = [];

  for (const fileName of postFiles) {
    const filePath = path.join(postsDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const title = typeof data.title === 'string' ? data.title : '';
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt : '';
    const tags = parseTags(data.tags);
    const result = evaluatePostContentQuality({ title, excerpt, tags });
    const slug = toSlug(fileName);

    for (const message of result.errors) {
      findings.push({ level: 'error', source: slug, message });
    }

    for (const message of result.warnings) {
      findings.push({ level: 'warning', source: slug, message });
    }
  }

  return { postFiles, findings };
}

export function runInternalLinksAudit(options: InternalLinksAuditOptions): ContentValidationResult {
  const rootDir = options.rootDir ?? process.cwd();
  const postsDir = getPostsDir(rootDir);
  const publicDir = getPublicDir(rootDir);
  const postFiles = collectPostFiles(rootDir);
  const postSlugs = new Set(postFiles.map(toSlug));
  const findings: AuditFinding[] = [];
  const inboundBySlug = new Map<string, number>();

  for (const slug of postSlugs) {
    inboundBySlug.set(slug, 0);
  }

  for (const fileName of postFiles) {
    const slug = toSlug(fileName);
    const filePath = path.join(postsDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractMarkdownLinkTargets(content);

    for (const { target } of links) {
      if (isExternalOrAnchorLink(target)) {
        continue;
      }

      const relativeWarning = validateRelativeLinkUsage(target);
      if (relativeWarning) {
        findings.push({ ...relativeWarning, source: slug });
        continue;
      }

      const normalized = normalizeLinkTarget(target);
      if (!normalized.startsWith('/')) {
        findings.push({
          level: 'warning',
          source: slug,
          message: `link "${target}" is not a site-absolute path and was skipped`,
        });
        continue;
      }

      if (normalized.startsWith('/blog/')) {
        const linkedSlug = normalized.replace(/^\/blog\//, '').replace(/\/$/, '');
        if (!linkedSlug) {
          continue;
        }
        if (!postSlugs.has(linkedSlug)) {
          findings.push({
            level: 'error',
            source: slug,
            message: `link "${target}" points to missing post slug "${linkedSlug}"`,
          });
          continue;
        }
        inboundBySlug.set(linkedSlug, (inboundBySlug.get(linkedSlug) ?? 0) + 1);
        continue;
      }

      if (normalized.startsWith('/images/') || normalized.startsWith('/icons/')) {
        const absoluteAssetPath = path.join(publicDir, normalized);
        if (!fs.existsSync(absoluteAssetPath)) {
          findings.push({
            level: 'error',
            source: slug,
            message: `asset "${target}" does not exist in public/`,
          });
        }
      }
    }
  }

  for (const [slug, inboundCount] of inboundBySlug.entries()) {
    if (inboundCount > 0) {
      continue;
    }
    const slugDate = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
    if (!slugDate) {
      continue;
    }
    const staleDate = new Date(`${slugDate[1]}-${slugDate[2]}-${slugDate[3]}T00:00:00.000Z`);
    const ageInDays = Math.floor((Date.now() - staleDate.getTime()) / 86_400_000);
    if (ageInDays < options.orphanWarnAfterDays) {
      continue;
    }
    findings.push({
      level: 'warning',
      source: slug,
      message: `post has no inbound links from other posts (potential stale orphan, ${ageInDays} days old)`,
    });
  }

  return { postFiles, findings };
}

export function runImageHygieneAudit(options: ImageHygieneAuditOptions): ContentValidationResult {
  const rootDir = options.rootDir ?? process.cwd();
  const postsDir = getPostsDir(rootDir);
  const publicDir = getPublicDir(rootDir);
  const postFiles = collectPostFiles(rootDir);
  const findings: AuditFinding[] = [];

  for (const fileName of postFiles) {
    const sourceLabel = getFindingSourceLabel('src/posts', fileName);
    const filePath = path.join(postsDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const images = extractMarkdownImages(content);

    for (const image of images) {
      if (!hasMeaningfulAltText(image.alt)) {
        findings.push({
          level: 'error',
          source: sourceLabel,
          message: `image "${image.src}" is missing alt text`,
        });
      }

      if (!image.src.startsWith('/')) {
        continue;
      }

      const assetPath = path.join(publicDir, image.src.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        findings.push({
          level: 'error',
          source: sourceLabel,
          message: `image "${image.src}" is missing in public/`,
        });
        continue;
      }

      const stat = fs.statSync(assetPath);
      const sizeStatus = classifyImageSize(
        stat.size,
        options.warningThresholdBytes,
        options.errorThresholdBytes
      );
      if (sizeStatus === 'warn') {
        findings.push({
          level: 'warning',
          source: sourceLabel,
          message: `image "${image.src}" is large (${stat.size} bytes); consider compressing`,
        });
      }
      if (sizeStatus === 'error') {
        findings.push({
          level: 'error',
          source: sourceLabel,
          message: `image "${image.src}" is too large (${stat.size} bytes)`,
        });
      }
    }
  }

  return { postFiles, findings };
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
