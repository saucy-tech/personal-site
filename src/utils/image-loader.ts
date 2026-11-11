'use client';

import manifest from '@/data/image-variants.generated.json';

type VariantManifest = Record<string, { sourceSha256: string; variants: Record<string, string> }>;

/**
 * next/image loader (images.loaderFile in next.config.js).
 *
 * The Worker has no image resizing, so `/_next/image` returned the original
 * bytes at every width. Sources listed in the manifest resolve to a committed,
 * pre-sized file instead: the smallest variant that covers the requested width,
 * or the largest one there is. Anything else is served as-is.
 * Variants come from `pnpm images:generate`.
 */
export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const entry = (manifest as VariantManifest)[src];
  if (!entry) return src;

  const widths = Object.keys(entry.variants)
    .map(Number)
    .sort((a, b) => a - b);
  const chosen = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  return entry.variants[String(chosen)] ?? src;
}
