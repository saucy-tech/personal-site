import fs from 'fs';
import path from 'path';

import {
  classifyImageSize,
  extractMarkdownImages,
  hasMeaningfulAltText,
} from '../src/utils/image-hygiene';

interface Finding {
  level: 'error' | 'warning';
  source: string;
  message: string;
}

const WARNING_THRESHOLD_BYTES = 1_000_000;
const ERROR_THRESHOLD_BYTES = 4_000_000;

function getPostFiles(postsDir: string): string[] {
  return fs.readdirSync(postsDir).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
}

function resolvePublicAssetPath(publicDir: string, src: string): string {
  return path.join(publicDir, src.replace(/^\//, ''));
}

function run(): number {
  const root = process.cwd();
  const postsDir = path.join(root, 'src', 'posts');
  const publicDir = path.join(root, 'public');
  const findings: Finding[] = [];
  const postFiles = getPostFiles(postsDir);

  for (const fileName of postFiles) {
    const sourceLabel = `src/posts/${fileName}`;
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

      const assetPath = resolvePublicAssetPath(publicDir, image.src);
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
        WARNING_THRESHOLD_BYTES,
        ERROR_THRESHOLD_BYTES
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

  const errors = findings.filter((item) => item.level === 'error');
  const warnings = findings.filter((item) => item.level === 'warning');
  console.log(`Checked image hygiene for ${postFiles.length} post files.`);

  if (warnings.length > 0) {
    console.warn(`\nImage hygiene warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.warn(`- [${warning.source}] ${warning.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nImage hygiene errors (${errors.length}):`);
    for (const error of errors) {
      console.error(`- [${error.source}] ${error.message}`);
    }
    console.error('\nImage hygiene check failed.');
    return 1;
  }

  console.log('\nImage hygiene check passed.');
  return 0;
}

process.exit(run());
