import fs from 'fs';
import path from 'path';

import {
  extractMarkdownLinkTargets,
  isExternalOrAnchorLink,
  normalizeLinkTarget,
  validateRelativeLinkUsage,
} from '../src/utils/link-hygiene';

interface Finding {
  level: 'error' | 'warning';
  slug: string;
  message: string;
}

const ORPHAN_WARN_AFTER_DAYS = 45;

function getPostFiles(postsDir: string): string[] {
  return fs.readdirSync(postsDir).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
}

function getPostSlugs(postFiles: string[]): Set<string> {
  return new Set(postFiles.map((file) => file.replace(/\.mdx?$/, '')));
}

function checkInternalLinks(): number {
  const root = process.cwd();
  const postsDir = path.join(root, 'src', 'posts');
  const publicDir = path.join(root, 'public');
  const findings: Finding[] = [];
  const postFiles = getPostFiles(postsDir);
  const postSlugs = getPostSlugs(postFiles);
  const inboundBySlug = new Map<string, number>();

  for (const slug of postSlugs) {
    inboundBySlug.set(slug, 0);
  }

  for (const fileName of postFiles) {
    const slug = fileName.replace(/\.mdx?$/, '');
    const filePath = path.join(postsDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractMarkdownLinkTargets(content);

    for (const { target } of links) {
      if (isExternalOrAnchorLink(target)) {
        continue;
      }

      const relativeWarning = validateRelativeLinkUsage(target);
      if (relativeWarning) {
        findings.push({ ...relativeWarning, slug });
        continue;
      }

      const normalized = normalizeLinkTarget(target);
      if (!normalized.startsWith('/')) {
        findings.push({
          level: 'warning',
          slug,
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
            slug,
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
            slug,
            message: `asset "${target}" does not exist in public/`,
          });
        }
      }
    }
  }

  for (const [slug, inboundCount] of inboundBySlug.entries()) {
    if (inboundCount === 0) {
      // orphan age check only applies to date-prefixed slugs (YYYY-MM-DD-*)
      const slugDate = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
      if (!slugDate) {
        continue;
      }
      const staleDate = new Date(`${slugDate[1]}-${slugDate[2]}-${slugDate[3]}T00:00:00.000Z`);
      const ageInDays = Math.floor((Date.now() - staleDate.getTime()) / 86_400_000);
      if (ageInDays < ORPHAN_WARN_AFTER_DAYS) {
        continue;
      }
      findings.push({
        level: 'warning',
        slug,
        message: `post has no inbound links from other posts (potential stale orphan, ${ageInDays} days old)`,
      });
    }
  }

  const errors = findings.filter((item) => item.level === 'error');
  const warnings = findings.filter((item) => item.level === 'warning');

  console.log(`Checked ${postFiles.length} posts for internal-link hygiene.`);

  if (warnings.length > 0) {
    console.warn(`\nInternal-link warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.warn(`- [${warning.slug}] ${warning.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nInternal-link errors (${errors.length}):`);
    for (const error of errors) {
      console.error(`- [${error.slug}] ${error.message}`);
    }
    console.error('\nInternal-link check failed.');
    return 1;
  }

  console.log('\nInternal-link check passed.');
  return 0;
}

process.exit(checkInternalLinks());
