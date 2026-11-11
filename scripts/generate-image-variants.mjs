#!/usr/bin/env node
// Regenerates the pre-sized image variants in public/optimized/ and the
// manifest the next/image loader reads (src/data/image-variants.generated.json).
//
// Production has no image resizing service: /_next/image returned the original
// bytes for every requested width. So the widths the pages ask for are built
// here, once, and committed. The originals under public/ stay the source of
// truth; rerun `pnpm images:generate` after changing one of them.
//
// Each output name carries a hash of its own bytes, so a changed image gets a
// new URL and public/_headers can cache /optimized/* as immutable.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');
const OUT_DIR = join(PUBLIC_DIR, 'optimized');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'image-variants.generated.json');

// images.deviceSizes / images.imageSizes in next.config.js decide the widths
// next/image asks for; the loader serves the smallest variant that covers each.
const PRODUCT_WIDTHS = [640, 960, 1280, 1600];
const SOURCES = [
  // 128px avatar: 1x and 2x.
  { src: '/headshot.jpeg', widths: [128, 256], quality: 82 },
  // Rendered at most 448px wide. The original is 1024px, so that is the 2x file.
  { src: '/bitcoin-journey.png', widths: [640, 1024], quality: 80 },
  ...readdirSync(join(PUBLIC_DIR, 'images', 'products'))
    .filter((name) => name.endsWith('.webp'))
    .sort()
    .map((name) => ({
      src: `/images/products/${name}`,
      widths: PRODUCT_WIDTHS,
      quality: 80,
    })),
];

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

mkdirSync(OUT_DIR, { recursive: true });
const manifest = {};
const keep = new Set();

for (const { src, widths, quality } of SOURCES) {
  const input = readFileSync(join(PUBLIC_DIR, src));
  const { width: sourceWidth } = await sharp(input).metadata();
  const stem = basename(src, extname(src));
  const variants = {};

  for (const width of widths) {
    if (width > sourceWidth) {
      throw new Error(`${src} is ${sourceWidth}px wide; cannot build a ${width}px variant`);
    }
    const output = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    const name = `${stem}-${width}.${sha256(output).slice(0, 10)}.webp`;
    writeFileSync(join(OUT_DIR, name), output);
    keep.add(name);
    variants[width] = `/optimized/${name}`;
    console.log(`${src} -> /optimized/${name} (${output.length} bytes)`);
  }

  manifest[src] = { sourceSha256: sha256(input), variants };
}

for (const name of readdirSync(OUT_DIR)) {
  if (!keep.has(name)) {
    rmSync(join(OUT_DIR, name));
    console.log(`removed stale /optimized/${name}`);
  }
}

writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${MANIFEST_PATH.slice(ROOT.length)}`);
