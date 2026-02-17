# personal-site

Next.js 15 (App Router) personal portfolio and blog. React 19, TypeScript, Tailwind CSS, MDX content, Framer Motion animations, Lightning Network payments via Alby SDK (NWC). Deployed on Vercel.

## Setup

- Node 18.18+ (Node 20 LTS recommended)
- Enable Corepack: `corepack enable`
- pnpm is pinned via `packageManager` in package.json

```sh
cp .env.example .env.local   # fill at least NEXT_PUBLIC_APP_URL
pnpm install
pnpm dev                      # http://localhost:3000
```

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — serve production build locally
- `pnpm lint` — ESLint
- `pnpm test` — Jest + React Testing Library
- `pnpm test:watch` — watch mode

## Environment Variables

Required:
- `NEXT_PUBLIC_APP_URL` — site URL (used for OpenGraph / post metadata)

Lightning payments:
- `NOSTR_WALLET_CONNECT_URL` — NWC connection string for Alby SDK

Optional LNURL-p config: `LNURL_MIN_SENDABLE`, `LNURL_MAX_SENDABLE`, `LNURL_COMMENT_ALLOWED`, `LNURL_METADATA_TEXT`, `LNURL_METADATA_DESC`

Optional ConvertKit broadcast (`scripts/auto-broadcast.ts`): `CK_SECRET_KEY`, `CK_PUBLISHER_ID`

## Project Layout

```
src/
├── app/            # App Router pages, layouts, API routes
├── components/     # Reusable UI (LinkCard, Profile, Section, SocialBar, SubscribeCard, ClientGalaxyBackground)
├── posts/          # MDX blog posts (frontmatter parsed by gray-matter)
├── utils/
│   ├── posts.ts    # getAllPostsMeta(), getPostBySlug(), getPostOgMeta()
│   ├── security.ts # CSP headers, rate-limit, validators
│   └── constants.ts# SITE_NAME, SITE_DESCRIPTION, SITE_URL
├── middleware.ts   # Applies security headers globally
public/             # Static images and icons
tailwind.config.js  # Custom spacing: section = 3rem
next.config.js      # Security headers (non-CSP), image domains
```

## Architecture

- **Routing**: App Router. `src/app/layout.tsx` provides global metadata, theme, fonts, animated background, header/footer. `src/app/page.tsx` composes Profile, SocialBar, and content Sections with LinkCard components.
- **Content**: MDX posts in `src/posts/*.mdx`. Frontmatter: `title`, `shortTitle` (optional), `date`, `excerpt`. Parsed by `gray-matter`, rendered via `next-mdx-remote` in RSC.
- **Styling**: Tailwind-first. Use `space-y-section` for vertical rhythm (3rem). Avoid custom CSS; prefer Tailwind utilities.
- **Background**: `ClientGalaxyBackground` renders an animated canvas. CSP must allow `data:`, `blob:`, and worker sources for it to function.

## Security

CSP is managed exclusively through middleware (`src/middleware.ts` → `src/utils/security.ts`). **Do not** add CSP via `next.config.js` or `<meta>` tags.

When adding external services:
- Update `connect-src`, `img-src`, `font-src`, etc. in `src/utils/security.ts`
- Add remote image domains to `next.config.js` `images.domains`

Verify headers: `curl -I http://localhost:3000` — expect a single `Content-Security-Policy` header.

Helpers in `src/utils/security.ts`: `getClientIP()`, `rateLimit()`, validators (`email`, `lightningAmount`, `text`, `paymentHash`), `createRateLimitResponse()`, `createSecureErrorResponse()`, `validateRequestSize()`, `logSecurityEvent()`.

## Testing

- Framework: Jest + React Testing Library (`jest.config.js` uses `next/jest`, `jsdom` environment)
- Path alias `@/` maps to `src/` in both `tsconfig.json` and `jest.config.js` `moduleNameMapper`
- Pre-commit: Husky + lint-staged for JS/TS files
- ESLint config: `eslint.config.mjs` (extends `next/core-web-vitals`)

## Adding a Blog Post

1. Create `src/posts/YYYY-MM-DD-slug.mdx`
2. Frontmatter:
   ```yaml
   title: "Your Post Title"
   shortTitle: "Card Label"
   date: "YYYY-MM-DD"
   excerpt: "One-liner for cards and OG."
   ```
3. The homepage displays the latest post via `getAllPostsMeta()[0]`
4. OG/Twitter metadata requires `NEXT_PUBLIC_APP_URL` to be set

## Deployment

- Platform: Vercel
- Set env vars in Vercel dashboard (`NEXT_PUBLIC_APP_URL`, `NOSTR_WALLET_CONNECT_URL`, etc.)
- CSP comes only from middleware — do not duplicate
- Verify in preview/prod: check Network tab for a single CSP header with expected directives

## Troubleshooting

- **Galaxy canvas blank in prod**: Ensure CSP includes `img-src data: blob: https:` and `worker-src blob: data:`. Check for duplicate CSP headers.
- **Fonts/images blocked in prod**: Update `font-src`/`img-src` in `src/utils/security.ts`; add remote domains to `next.config.js` `images.domains`.
- **Scripts blocked in prod**: `unsafe-eval` is only allowed in non-production. Verify no library requires eval in prod.
- **Lightning payments not working**: Confirm `NOSTR_WALLET_CONNECT_URL` is valid. CSP `connect-src` allows `wss:`.
