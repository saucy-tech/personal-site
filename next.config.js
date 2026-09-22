const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/field-notes/:path*', destination: '/notes/:path*', permanent: true },
      { source: '/notebook', destination: '/notes', permanent: true },
      { source: '/state-of-ai', destination: '/notes', permanent: true },
      { source: '/projects', destination: '/portfolio', permanent: true },
      {
        source: '/blog/2026-05-19-mercy-while-the-nails-held',
        destination: '/blog/2026-05-18-mercy-while-the-nails-held',
        permanent: true,
      },
    ];
  },
  // Security headers (CSP, X-Frame-Options, etc.) are set by src/middleware.ts
  // via getSecurityHeaders(); defining them here too doubled every header value.
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
