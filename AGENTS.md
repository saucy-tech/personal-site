# personal-site

Next.js 16 (App Router) personal portfolio and blog. React 19, TypeScript 5, Tailwind CSS, MDX content, Framer Motion animations, Lightning Network payments via Alby SDK (NWC). Deployed on Vercel.

## Setup

- Node 20.9+
- Enable Corepack: `corepack enable`
- pnpm is pinned via `packageManager` in package.json
- Next.js 16 uses Turbopack by default for `next dev` and `next build`; the existing scripts intentionally do not need `--turbopack`

```sh
cp .env.example .env.local   # fill the vars needed for your workflow
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

Note: In Next.js 16, `pnpm build` does not run ESLint automatically. Run `pnpm lint` explicitly.

## Environment Variables

Required for core site features:
- `NOSTR_WALLET_CONNECT_URL` — NWC connection string used by the Lightning invoice and LNURL endpoints

Optional site / broadcast config:
- `NEXT_PUBLIC_APP_URL` — used by `scripts/auto-broadcast.ts` to build absolute URLs for the ConvertKit broadcast workflow. It is not the primary source of site metadata or canonical URLs in the app today; those mostly come from `SITE_URL` in `src/utils/constants.ts` and metadata defined in `src/app/layout.tsx`

Optional LNURL-p config:
- `LNURL_MIN_SENDABLE`
- `LNURL_MAX_SENDABLE`
- `LNURL_COMMENT_ALLOWED`
- `LNURL_METADATA_TEXT`
- `LNURL_METADATA_DESC`

Optional ConvertKit subscribe form:
- `CONVERTKIT_API_KEY`
- `CONVERTKIT_FORM_ID`

Optional ConvertKit broadcast script (`scripts/auto-broadcast.ts`):
- `CK_SECRET_KEY`
- `CK_PUBLISHER_ID`
- `NEXT_PUBLIC_APP_URL` is also required when running this script

Present in `.env.example` but currently unused by the codebase:
- `DEBUG`

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
├── middleware.ts   # Current CSP/security entrypoint; Next.js 16 renames this convention to proxy.ts
public/             # Static images and icons
tailwind.config.js  # Custom spacing: section = 3rem
next.config.js      # Security headers (non-CSP), image domains
```

## Architecture

- **Routing**: App Router. `src/app/layout.tsx` provides global metadata, theme, fonts, animated background, header/footer. `src/app/page.tsx` composes Profile, SocialBar, and content Sections with LinkCard components.
- **Content**: MDX posts in `src/posts/*.mdx`. Frontmatter: `title`, `shortTitle` (optional), `date`, `excerpt`, `category`. Parsed by `gray-matter`, rendered via `next-mdx-remote` in RSC.
- **Styling**: Tailwind-first. Use `space-y-section` for vertical rhythm (3rem). Avoid custom CSS; prefer Tailwind utilities.
- **Metadata**: Global and page metadata mostly use `SITE_URL` from `src/utils/constants.ts` plus metadata exports in `src/app/**`. Post OG metadata is generated in `src/utils/posts.ts`. `NEXT_PUBLIC_APP_URL` is currently for the broadcast script, not the main metadata source of truth.
- **Background**: `ClientGalaxyBackground` renders an animated canvas. CSP must allow `data:`, `blob:`, and worker sources for it to function.

## Security

Security headers are currently applied via `src/middleware.ts` -> `src/utils/security.ts`. In Next.js 16, the `middleware.ts` file convention is deprecated in favor of `proxy.ts`, so treat this as the repo's current implementation detail rather than new framework guidance. CSP is still managed exclusively from this path. **Do not** add CSP via `next.config.js` or `<meta>` tags.

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
   category: "Daily Word"
   ```
3. The homepage displays the latest post via `getAllPostsMeta()[0]`
4. OG/Twitter metadata for the site and posts currently derives from `SITE_URL` in `src/utils/constants.ts` and metadata exports in `src/app/**`; `NEXT_PUBLIC_APP_URL` is only required for `scripts/auto-broadcast.ts`

## Deployment

- Platform: Vercel
- Set the env vars needed by the features you are deploying: `NOSTR_WALLET_CONNECT_URL` for Lightning flows, `CONVERTKIT_API_KEY` / `CONVERTKIT_FORM_ID` for `/api/subscribe`, and `CK_SECRET_KEY` / `CK_PUBLISHER_ID` plus `NEXT_PUBLIC_APP_URL` for `scripts/auto-broadcast.ts`
- CSP comes only from `src/middleware.ts` -> `src/utils/security.ts` in the current repo; do not duplicate it in `next.config.js` or `<meta>` tags
- Verify in preview/prod: check Network tab for a single CSP header with expected directives

## Troubleshooting

- **Galaxy canvas blank in prod**: Ensure CSP includes `img-src data: blob: https:` and `worker-src blob: data:`. Check for duplicate CSP headers.
- **Fonts/images blocked in prod**: Update `font-src`/`img-src` in `src/utils/security.ts`; add remote domains to `next.config.js` `images.domains`.
- **Scripts blocked in prod**: `unsafe-eval` is only allowed in non-production. Verify no library requires eval in prod.
- **Lightning payments not working**: Confirm `NOSTR_WALLET_CONNECT_URL` is valid. CSP `connect-src` allows `wss:`.
