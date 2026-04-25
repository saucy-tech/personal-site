# Site improvements — design summary

Consolidated implementation of the Site Improvement Survey (2026-04-25). Scope:

1. **DX / deps**: Remove unused packages; optional bundle analyzer; `remotePatterns` for images.
2. **Middleware**: Wire `src/proxy.ts` as Next.js middleware so CSP + nonce apply on every request.
3. **MDX**: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`; TOC heading IDs aligned with `github-slugger` (same as `rehype-slug`).
4. **SEO**: Richer RSS; tag, category, and month archive routes; sitemap extensions.
5. **Blog UX**: URL-synced archive filters; prev/next navigation; reading progress; per-post tip CTA; support page `?memo=`.
6. **Newsletter**: Honeypot + friendlier ConvertKit error handling.
7. **Lightning**: Singleton `NWCClient`; TipJar lazy chunks for QR/confetti; polling backoff + max duration.
8. **Security / observability**: Structured security logs; optional CSP-Report-Only; webmention receiver stub; `rel="me"` on social links.
9. **Testing / CI**: Playwright smoke tests; Lighthouse CI workflow (URLs + artifact upload).
10. **Sentry**: Optional `instrumentation.ts` init when `SENTRY_DSN` is set.

JSON-LD remains nonce-backed via `headers()` until a follow-up explores hash-based or metadata-only structured data without weakening CSP.
