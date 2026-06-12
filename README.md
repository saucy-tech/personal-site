# Personal Portfolio & Blog

A modern, accessible portfolio and blog built with Next.js, React, and MDX. This site showcases my projects, technical talks, and blog posts, with a focus on technology, user experience, and performance.

This repo uses pnpm pinned via Corepack (see package.json "packageManager").

## Features

- ⚡ Built with Next.js 16 (App Router), React 19, and Tailwind CSS
- 📝 Custom blog with MDX support and syntax highlighting
- 💻 Portfolio page (`/portfolio`) with detailed tech stack and features
- 🎤 Talks & sermons archive
- ⚡ Lightning Network integration for tips and donations
- 🌗 Responsive design with dark mode support
- 🎨 Subtle UI animations and clean, modern design
- ♿ Accessibility and performance best practices
- 🔒 All content managed locally with Git
- 📱 Mobile-first, responsive layout
- 📡 RSS feed and sitemap generation

## Project Structure

```
personal-site/
├── .github/workflows/         # CI, devotion broadcast, lighthouse
├── docs/                      # Runbooks and generated architecture docs
├── public/                    # Static assets
│   └── images/blog/           # Blog post images
├── scripts/                   # Content validators, broadcast, doc gen
├── src/
│   ├── app/                   # Next.js App Router (api, blog, portfolio, ...)
│   ├── components/            # Reusable UI (LinkCard, Section, SocialBar, ...)
│   ├── posts/                 # MDX blog posts (frontmatter parsed by gray-matter)
│   ├── types/                 # Shared TypeScript types
│   ├── utils/                 # posts.ts, security.ts, constants.ts
│   └── proxy.ts               # CSP/security headers (Next.js file convention)
├── tests/                     # Playwright E2E specs
├── next.config.js
├── package.json
└── README.md
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 6
- **UI**: React 19, Tailwind CSS 4, `@tailwindcss/typography`
- **Content**: MDX for blog posts (`next-mdx-remote`, `gray-matter`)
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Payments**: Lightning Network integration (Alby SDK / NWC)
- **Testing**: Jest + React Testing Library, Playwright (E2E)
- **Deployment**: Cloudflare Workers (OpenNext adapter)
- **Linting**: ESLint 9 + Prettier (Husky + lint-staged pre-commit)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saucy-tech/personal-site.git
   cd personal-site
   ```

2. **Install dependencies:**

   ```bash
   corepack enable
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Resume PDF

The downloadable résumé at `/Brandon_Sauceda_Resume.pdf` is copied from Career-Dev:

```bash
cp ~/Documents/Career-Dev/01_Current_Packet/Resume/Brandon_Sauceda_Resume_ATS.pdf public/Brandon_Sauceda_Resume.pdf
```

Regenerate after editing `v2_Concise_ATS.md` in Career-Dev.

For the styled export, generate the HTML with `pagetitle` metadata so the PDF/browser title is clean and no extra visible resume heading is inserted:

```bash
cd ~/Documents/Career-Dev/01_Current_Packet/Resume
pandoc v2_Concise_ATS.md --standalone --css resume.css --metadata pagetitle='Brandon Sauceda' -o v2_Concise_ATS_STYLED.html
```

## Daily Devotion Workflow

Daily Word devotions are the primary content pipeline. The lifecycle:

1. Brandon drafts the lesson in his Sunday School Obsidian vault.
2. The `the-daily-word` Cowork skill reads today's entry, generates an MDX post
   under `src/posts/YYYY-MM-DD-slug.mdx`, and opens a draft PR on this repo
   labeled `devotion`.
3. On merge to `main`, `.github/workflows/devotion-broadcast.yml` fires and
   sends the post to ConvertKit (the "The Daily Word" email list) using
   `KIT_API_KEY`.
4. The merge is deployed to production automatically by Cloudflare Workers
   Builds (Git integration).

Writing rules and quality checks for published content live in the scripts and
runbooks in [`docs/`](./docs).

`pnpm broadcast` is retained as a **manual fallback only** and is not the
primary publishing path.

## Contributing

Contributions are welcome — open an issue or PR. Run `pnpm quality:gate` before
pushing; CI runs the same gate plus build and E2E smoke tests.

## Development

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required for Lightning Network functionality
NOSTR_WALLET_CONNECT_URL=your_nwc_url_here

# Optional LNURL-p configuration
LNURL_MIN_SENDABLE=1000
LNURL_MAX_SENDABLE=1000000000
LNURL_COMMENT_ALLOWED=280
LNURL_METADATA_TEXT="Tip to brandon"
LNURL_METADATA_DESC="Lightning tip jar for brandon"

# Next.js App URL (for OpenGraph)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional canonical site URL override for metadata and absolute URLs
SITE_URL=https://your-domain.com

# ConvertKit API configuration for email subscriptions (optional)
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# ConvertKit v4 API — optional manual fallback for `pnpm broadcast`
CK_SECRET_KEY=        # Settings → Advanced → API Secret
CK_PUBLISHER_ID=      # numeric account ID from Settings → Advanced

# Optional distributed rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional CSP/reporting toggles
ENABLE_CSP_VIOLATION_REPORTS=0
CSP_REPORT_ONLY=0

# Optional error monitoring
SENTRY_DSN=
```

### GitHub Actions Secrets

The devotion broadcast workflow is the primary production path. Configure these in **GitHub → Settings → Secrets and variables → Actions**:

| Name | Type | Required by | Description |
|------|------|-------------|-------------|
| `KIT_API_KEY` | Secret | `devotion-broadcast.yml` | ConvertKit API key for the merge-based broadcast workflow |
| `NEXT_PUBLIC_APP_URL` | Variable | `devotion-broadcast.yml` | Your production site URL |

`pnpm broadcast` is retained as a manual fallback. It creates a draft broadcast from the latest post by frontmatter date and should not be treated as the primary publishing path.

### Component Architecture

The app uses a consistent vertical spacing system:

- Main sections are spaced using Tailwind's `space-y-section` utility
- Each section maintains its own internal spacing
- Link cards within sections use consistent padding and margins
- The profile section sits at the top with proper spacing to content below
- Social bar and sections maintain visual hierarchy through spacing

### Seasonal Features

The snowflake animation (falling snow with a toggle button) is a **winter-only** feature. It was removed from the active layout because it is distracting outside of winter, especially on mobile.

To re-enable it for the winter season:

1. Open `src/app/layout.tsx`
2. Add the import: `import ClientSnowflakes from '@/components/ClientSnowflakes';`
3. Add the component inside the background `<div>`, after `<ClientGalaxyBackground />`:
   ```tsx
   {/* Winter snowflakes with toggle */}
   <ClientSnowflakes />
   ```

The component files are preserved at:
- `src/components/Snowflakes.tsx` — canvas-based snowflake animation
- `src/components/ClientSnowflakes.tsx` — client-side toggle with reduced-motion support

### Development Tips

1. **Content Updates**: Most content is defined in `src/app/page.tsx` as JavaScript objects
2. **Adding Links**: Add new `<LinkCard>` components within appropriate `<Section>` components
3. **Profile Changes**: Update the `profileData` object with your information
4. **Styling**: Use Tailwind CSS classes for styling - avoid custom CSS where possible
5. **Images**: Place images in the `public` directory and reference them in components
6. **Spacing**: Use the built-in spacing utilities for consistent layout

### Content Quality Validation

Run `pnpm content:validate` before opening a PR that adds or updates posts.

This command validates all MDX post metadata and quality constraints:
- title length target (`20-72` chars)
- excerpt length target (`90-180` chars)
- duplicate tag detection (warning)
- missing tags detection (warning)

The command exits non-zero for quality errors and is enforced in CI.

Run `pnpm content:check-links` to verify internal blog links and static image/icon references from MDX content.

This check:
- fails for broken `/blog/<slug>` links
- fails for missing `/images/*` or `/icons/*` assets
- warns on relative links and posts with no inbound links from other posts

Run `pnpm content:check-images` to validate MDX image hygiene.

This check:
- fails on missing alt text in markdown image syntax
- fails when a local image reference is missing in `public/`
- warns on large images and fails for oversized images

Run `pnpm docs:architecture` to regenerate the local `docs/architecture-map.md` report after adding routes, API endpoints, or major utility/component files. That report is gitignored.

Run `pnpm quality:gate` as the local "definition of done" check before pushing. It runs:
- `pnpm lint`
- `pnpm test`
- `pnpm content:validate`
- `pnpm content:check-links`
- `pnpm content:check-images`
- `pnpm security:drift`

CI now uses this same `quality:gate` command before build and E2E smoke checks.

Operational runbooks:
- `docs/runbooks/api-incident-response.md`
- `docs/runbooks/content-guardrails.md`
- `docs/security-performance-observability.md`

## Deployment

The site deploys to Cloudflare Workers via the
[OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare).

Pushes are built and deployed automatically by
[Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
(Git integration): branches get preview URLs, merges to `main` deploy
production. For a manual deploy:

```bash
pnpm deploy   # opennextjs-cloudflare build + deploy (keeps existing Worker vars)
```

Ensure all environment variables and secrets are configured on the Worker.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by modern link aggregation services
- Galaxy animation adapted from various open source implementations
- Built with the Next.js framework
- Lightning Network integration via Alby SDK

## Content Security Policy (Cloudflare Workers)

The CSP is applied per-request by Next.js middleware so it behaves the same in
local development and on Cloudflare Workers (OpenNext) in production.

Key files:

- [src/middleware.ts](src/middleware.ts) - generates a nonce and applies the headers
- [src/utils/security.ts](src/utils/security.ts) - `getSecurityHeaders()` builds the policy
- [scripts/check-security-drift.ts](scripts/check-security-drift.ts) - validates the production policy in `pnpm quality:gate`
- [next.config.js](next.config.js) - non-CSP fallback headers and `poweredByHeader: false`

Environment behavior:

- The policy branches on `NODE_ENV`, not on hosting-platform env vars. `next dev`
  (`NODE_ENV=development`) allows `'unsafe-eval'` for HMR/React Refresh; every
  other environment - production builds, the Worker runtime, anything
  unrecognized - fails closed to the strict policy.
- The strict policy drops `'unsafe-eval'` and adds `upgrade-insecure-requests`.
- History: the original gate keyed on `VERCEL`/`VERCEL_ENV`, which do not exist
  on Cloudflare Workers, so production served the development policy after the
  migration (caught 2026-06-12). Platform-specific env detection is the failure
  mode to avoid here.

Effective CSP highlights (production):

- default-src 'self'
- script-src 'self' 'unsafe-inline' 'nonce-…' blob: (no 'unsafe-eval')
- style-src 'self' 'unsafe-inline' data:
- img-src 'self' data: blob: https: (required for canvas pixel operations and assets)
- media-src 'self' data: blob:
- worker-src 'self' blob: data:
- child-src 'self' blob: data:
- connect-src 'self' https://api.coingecko.com https: wss:
- font-src 'self' data: https:
- object-src 'none', frame-src 'none', frame-ancestors 'none'
- base-uri 'self', form-action 'self'
- upgrade-insecure-requests

Drift enforcement:

- `pnpm security:drift` builds the headers with the production branch forced and
  fails if `'unsafe-eval'` appears or `upgrade-insecure-requests` is missing,
  alongside the baseline directive checks. It runs as part of `pnpm quality:gate`.
- `src/utils/security.test.ts` pins both branches: development keeps eval,
  production and unset environments do not.

Verification steps:

1. Local dev: `curl -I http://localhost:3000`
   - content-security-policy present; script-src includes 'unsafe-eval' (dev only)
2. Worker preview: `pnpm preview`, then `curl -I http://localhost:8787`
   - script-src has no 'unsafe-eval'; upgrade-insecure-requests present
3. Production: `curl -sI https://saucy.tech | grep -i content-security-policy`
   - same strict policy as the preview

Operational notes:

- Do not add another CSP header via next.config.js or meta tags; CSP is
  centralized in [src/middleware.ts](src/middleware.ts) using
  [src/utils/security.ts](src/utils/security.ts).
- If adding new external APIs or CDNs, extend connect-src, font-src, img-src,
  etc., explicitly in [src/utils/security.ts](src/utils/security.ts).
- If adding WebAssembly or specialized workers, ensure script-src and worker-src
  account for those needs without broadening to unsafe directives in production.

Troubleshooting:

- If the galaxy canvas is blank on first load, check the document response has
  the CSP header above and that no second CSP header is present (duplicates can
  override each other). Keep CSP only in middleware.
- If fonts or images fail in production but work locally, verify the
  corresponding src directives (font-src/img-src) include https: and
  data:/blob: as applicable.
- If scripts are blocked in production, fix the script rather than reintroducing
  'unsafe-eval'.
