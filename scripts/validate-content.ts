import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import { evaluatePostContentQuality } from '../src/utils/content-quality';

type FindingLevel = 'error' | 'warning';

interface Finding {
  level: FindingLevel;
  slug: string;
  message: string;
}

// @ts-expect-error gray-matter engines are runtime-configurable.
matter.engines.yaml = {
  parse: (value: string) => yaml.load(value) as Record<string, unknown>,
  stringify: (value: Record<string, unknown>) => yaml.dump(value),
};

function run(): number {
  const findings: Finding[] = [];
  const postsDir = path.join(process.cwd(), 'src', 'posts');
  const postFiles = fs
    .readdirSync(postsDir)
    .filter((file: string) => file.endsWith('.mdx') || file.endsWith('.md'));

  for (const fileName of postFiles) {
    const slug = fileName.replace(/\.mdx?$/, '');
    const filePath = path.join(postsDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const title = typeof data.title === 'string' ? data.title : '';
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt : '';
    const tags =
      Array.isArray(data.tags) && data.tags.every((tag) => typeof tag === 'string')
        ? data.tags
        : typeof data.tags === 'string'
          ? [data.tags]
          : [];
    const result = evaluatePostContentQuality({
      title,
      excerpt,
      tags,
    });

    for (const message of result.errors) {
      findings.push({ level: 'error', slug, message });
    }

    for (const message of result.warnings) {
      findings.push({ level: 'warning', slug, message });
    }
  }

  const errors = findings.filter((finding) => finding.level === 'error');
  const warnings = findings.filter((finding) => finding.level === 'warning');

  console.log(`Validated ${postFiles.length} posts.`);

  if (errors.length > 0) {
    console.error(`\nContent quality errors (${errors.length}):`);
    for (const finding of errors) {
      console.error(`- [${finding.slug}] ${finding.message}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\nContent quality warnings (${warnings.length}):`);
    for (const finding of warnings) {
      console.warn(`- [${finding.slug}] ${finding.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('\nContent validation failed due to quality errors.');
    return 1;
  }

  console.log('\nContent validation passed.');
  return 0;
}

process.exit(run());
