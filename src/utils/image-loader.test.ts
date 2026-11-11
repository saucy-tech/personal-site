import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import manifest from '@/data/image-variants.generated.json';
import imageLoader from '@/utils/image-loader';

const nextConfig = require('../../next.config.js');

const publicDir = path.join(process.cwd(), 'public');
const entries = Object.entries(manifest);

describe('imageLoader', () => {
  it('serves the smallest variant that covers the requested width', () => {
    expect(imageLoader({ src: '/headshot.jpeg', width: 128 })).toMatch(
      /^\/optimized\/headshot-128\.[0-9a-f]{10}\.webp$/
    );
    expect(imageLoader({ src: '/headshot.jpeg', width: 200 })).toMatch(/headshot-256\./);
    expect(imageLoader({ src: '/images/products/home-hive.webp', width: 960 })).toMatch(
      /home-hive-960\./
    );
  });

  it('falls back to the largest variant instead of upscaling', () => {
    expect(imageLoader({ src: '/headshot.jpeg', width: 1600 })).toMatch(/headshot-256\./);
    expect(imageLoader({ src: '/bitcoin-journey.png', width: 1280 })).toMatch(
      /bitcoin-journey-1024\./
    );
  });

  it('leaves sources without variants untouched', () => {
    expect(imageLoader({ src: '/icons/x-logo.svg', width: 64 })).toBe('/icons/x-logo.svg');
  });
});

describe('image variant manifest', () => {
  it.each(entries)('%s variants exist and match the current original', (src, entry) => {
    const original = fs.readFileSync(path.join(publicDir, src));
    // A mismatch means the original changed: run `pnpm images:generate`.
    expect(createHash('sha256').update(original).digest('hex')).toBe(entry.sourceSha256);
    for (const file of Object.values(entry.variants)) {
      expect(fs.existsSync(path.join(publicDir, file))).toBe(true);
    }
  });

  it('has no orphaned files in public/optimized', () => {
    const listed = entries.flatMap(([, entry]) => Object.values(entry.variants)).sort();
    const onDisk = fs
      .readdirSync(path.join(publicDir, 'optimized'))
      .map((name) => `/optimized/${name}`)
      .sort();
    expect(onDisk).toEqual(listed);
  });

  it('gives every product preview a file at each width next/image lists in a srcset', () => {
    const { deviceSizes } = nextConfig.images;
    for (const [src, entry] of entries) {
      if (!src.startsWith('/images/products/')) continue;
      expect(Object.keys(entry.variants).map(Number)).toEqual(deviceSizes);
    }
  });
});
