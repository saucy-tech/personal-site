const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/field-notes', destination: '/notes', permanent: true },
      {
        source: '/field-notes/opengraph-image',
        destination: '/notes/opengraph-image',
        permanent: true,
      },
      { source: '/notebook', destination: '/notes', permanent: true },
      { source: '/state-of-ai', destination: '/notes', permanent: true },
      { source: '/projects', destination: '/portfolio', permanent: true },
      {
        source: '/blog/2026-05-19-mercy-while-the-nails-held',
        destination: '/blog/2026-05-18-mercy-while-the-nails-held',
        permanent: true,
      },
      // Retired blog index surfaces; posts stay at /blog/[slug].
      { source: '/blog/category/:category', destination: '/blog', permanent: true },
      { source: '/blog/tag/:tag', destination: '/blog', permanent: true },
      { source: '/blog/series', destination: '/blog', permanent: true },
      { source: '/blog/series/:series', destination: '/blog', permanent: true },
      { source: '/blog/archive/:year/:month', destination: '/blog', permanent: true },
    ];
  },
  // Security headers (CSP, X-Frame-Options, etc.) are set by src/middleware.ts
  // via getSecurityHeaders(); defining them here too doubled every header value.
  // The Worker has no image resizing, so /_next/image served the original file
  // at every width. The loader maps each requested width to a committed,
  // pre-sized file in public/optimized (see scripts/generate-image-variants.mjs).
  // These lists are the only widths next/image will ask for, and each one has a
  // file: deviceSizes for the product previews, imageSizes for the avatar and icons.
  images: {
    loader: 'custom',
    loaderFile: './src/utils/image-loader.ts',
    remotePatterns: [],
    deviceSizes: [640, 960, 1280, 1600],
    imageSizes: [32, 64, 128, 256],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
