const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/notebook', destination: '/field-notes', permanent: true },
      { source: '/state-of-ai', destination: '/field-notes', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), fullscreen=(self)',
          },
          // CSP is handled by src/proxy.ts with dynamic nonces
          // Removing duplicate CSP header that conflicts with proxy
        ],
      },
    ];
  },
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
