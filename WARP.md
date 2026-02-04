# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

# WARP Guide: personal-site

A focused guide for working quickly and safely in this Next.js personal portfolio/blog codebase. This document is optimized for Warp and AI agents to get productive fast.

## TL;DR Quickstart

- Requirements
  - Node 18.18+ (Node 20 LTS recommended)
  - Corepack enabled (run once per machine: corepack enable)
  - pnpm (pinned via packageManager)
- Install and run (first time)
  - cp .env.example .env.local
  - Fill at least NEXT_PUBLIC_APP_URL in .env.local
  - pnpm install
  - pnpm dev
  - Open http://localhost:3000

Git tip: Prefer --no-pager to see full output without paging:
- git --no-pager status
- git --no-pager diff

## Project Summary

- Framework: Next.js 15 (App Router), React 19, TypeScript
- Styling: Tailwind CSS (+ @tailwindcss/typography), minimal custom CSS
- Content: MDX blog posts under src/posts, parsed with gray-matter and rendered via next-mdx-remote in RSC
- UI/UX: Framer Motion animations, LinkCard/Section components, responsive, dark-friendly theme
- Security: Strict headers applied via middleware (CSP, Permissions-Policy, etc.), rate-limiting and validators under src/utils/security.ts
- Payments: Lightning Network integration via Alby SDK (NWC), support page
- Deploy: Vercel (preview/prod), image optimization via Next Image

## Common Commands

- Start dev server: pnpm dev
- Build production: pnpm build
- Run production locally: pnpm start
- Lint: pnpm lint
- Tests (Jest + RTL): pnpm test
- Watch tests: pnpm test:watch
- Husky install (auto via prepare): pnpm run prepare

## Environment Setup

Copy and edit:
- cp .env.example .env.local

Key variables:
- NOSTR_WALLET_CONNECT_URL: Required for Lightning payments (NWC)
- LNURL_MIN_SENDABLE, LNURL_MAX_SENDABLE, LNURL_COMMENT_ALLOWED, LNURL_METADATA_TEXT, LNURL_METADATA_DESC: Optional LNURL-p config
- NEXT_PUBLIC_APP_URL: Your site URL (required for OpenGraph and post OG metadata)

Optional for ConvertKit broadcast script (scripts/auto-broadcast.ts):
- CK_SECRET_KEY: ConvertKit v4 secret
- CK_PUBLISHER_ID: ConvertKit numeric publisher id

Note: For the ConvertKit script, you will need ts-node or tsx locally (see Automation section).

## Repository Layout

Top-level highlights:
- public/ images and icons
- src/app/ Next.js App Router pages, layouts, API routes
- src/components/ Reusable UI components (LinkCard, Profile, Section, etc.)
- src/posts/ MDX blog posts
- src/utils/ Shared utilities: posts.ts (MDX/metadata), security.ts (CSP, rate-limit, validators)
- src/middleware.ts Security headers applied globally
- tailwind.config.js Tailwind setup (custom spacing: section = 3rem)
- next.config.js Security headers (excluding CSP), image config

## App Architecture Overview

- Routing and Layout
  - App router entry at src/app/layout.tsx supplies global metadata, theme color, Google font, animated background, header/footer.
  - Home page at src/app/page.tsx composes Profile, SocialBar, Content Sections using LinkCard components.

- Content (MDX)
  - Posts live under src/posts/*.mdx with frontmatter parsed by gray-matter.
  - Utility functions in src/utils/posts.ts:
    - getAllPostsMeta(): returns sorted frontmatter summaries
    - getPostBySlug(slug): returns content + metadata
    - getPostOgMeta(slug): builds OG/Twitter metadata using NEXT_PUBLIC_APP_URL
  - Frontmatter fields:
    - title (string)
    - cardTitle or shortTitle (string, optional, preferred shortTitle)
    - date (ISO-like string)
    - excerpt (string)

- UI Components
  - LinkCard: animated link card with icon/image and hover effects
  - Section: logical content groupings used on homepage
  - Profile, SocialBar, SubscribeCard: user profile display and social/tip/subscription widgets
  - ClientGalaxyBackground: client-side animated galaxy background (canvas)

- Styling and Spacing
  - Tailwind first. The theme defines spacing.section = 3rem (use space-y-section for vertical rhythm).
  - Avoid custom CSS where possible; use Tailwind utilities.

## Security Model and Headers

- Centralized headers via middleware
  - src/middleware.ts reads getSecurityHeaders() and applies to all paths (except api, _next/static, _next/image, favicon.ico, public).
  - Avoid duplicating CSP via next.config.js or meta tags; CSP is added via middleware only.

- getSecurityHeaders()
  - Location: src/utils/security.ts
  - Environment-aware detection for Vercel (VERCEL, VERCEL_ENV)
  - Key directives (production on Vercel):
    - default-src 'self'
    - script-src 'self' 'unsafe-inline' blob:
    - style-src 'self' 'unsafe-inline' data:
    - img-src 'self' data: blob: https:
    - font-src 'self' data: https:
    - connect-src 'self' https://api.coingecko.com https: wss:
    - media-src 'self' data: blob:
    - worker-src 'self' blob: data:
    - child-src 'self' blob: data:
    - object-src 'none'; frame-src 'none'; frame-ancestors 'none'
    - base-uri 'self'; form-action 'self'; manifest-src 'self'
    - upgrade-insecure-requests (production only)
  - Also sets: X-Frame-Options DENY, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, etc.

- Verify CSP with:
    - curl -I http://localhost:3000
    - Ensure only one Content-Security-Policy header exists and directives match expectations.

- When adding external services:
  - Extend connect-src, img-src, font-src, etc., in src/utils/security.ts explicitly.
  - If adding remote images, also add domains in next.config.js images.domains.

- Helpers and rate limiting:
  - getClientIP(): extracts client IP from headers
  - rateLimit(): simple in-memory token bucket with configurable windows
  - validators: email, lightningAmount (sats/msats), text, paymentHash
  - createRateLimitResponse(), createSecureErrorResponse(), validateRequestSize(), logSecurityEvent()

## Development Workflow

- Add a blog post
  1) Create src/posts/2025-01-01-my-post.mdx
  2) Frontmatter example:
     ---
     title: "Your Post Title"
     shortTitle: "Card Label"
     date: "2025-01-01"
     excerpt: "One-liner that will appear in cards and OG."
     ---
     Your MDX content here.
  3) Home page will show the latest post via getAllPostsMeta()[0].
  4) For OG/Twitter, ensure NEXT_PUBLIC_APP_URL is set.

- Edit homepage content
  - src/app/page.tsx holds:
    - profileData (name, bio, imageSrc)
    - socialLinks (X, GitHub, Nostr, Discord icons in public/icons)
    - Sections with LinkCard entries (Latest, Explore, Connect)
  - Add more LinkCard entries inline.

- Update global metadata and icons
  - src/app/layout.tsx sets Metadata (OpenGraph, Twitter, icons).
  - Replace placeholder openGraph.url and image references as needed.
  - Consider aligning with src/utils/constants.ts (SITE_NAME, SITE_DESCRIPTION, SITE_URL).

- Galaxy background
  - ClientGalaxyBackground renders an animated canvas background.
  - CSP allows data:/blob:/workers required for canvas behavior.

## Automation: ConvertKit Broadcast (optional)

- Script: scripts/auto-broadcast.ts
  - Purpose: Creates a DRAFT broadcast of the latest blog post intro + link via ConvertKit v4 API after deploy.
  - Env: CK_SECRET_KEY, CK_PUBLISHER_ID, NEXT_PUBLIC_APP_URL
  - Run:
    - Install ts-node or tsx locally: pnpm add -D ts-node
    - pnpm dlx ts-node scripts/auto-broadcast.ts
    - or: pnpm dlx tsx scripts/auto-broadcast.ts
  - CI: Optionally wire as a post-deploy step (guarded to only run on main/prod).

Note: ts-node is not currently in devDependencies; add it if you plan to use this script.

## Testing and Quality

- Jest + RTL
  - Config: jest.config.js (next/jest), testEnvironment jsdom
  - Aliases: '@/' mapped to src in Jest via moduleNameMapper; ensure tsconfig paths match
  - Commands: pnpm test, pnpm test:watch
- ESLint + Prettier
  - ESLint config: eslint.config.mjs (extends next/core-web-vitals)
  - Pre-commit: husky + lint-staged for JS/TS files
  - Run explicitly: pnpm lint

## Deployment

- Platform: Vercel (recommended)
- Environment variables: Configure .env equivalents in Vercel (NEXT_PUBLIC_APP_URL, NOSTR_WALLET_CONNECT_URL, etc.)
- CSP: Do not add a second CSP via next.config.js or meta tags; middleware handles CSP.
- Images: Add external domains to next.config.js images.domains if needed
- Verify headers in preview/prod:
  - Use devtools Network tab on the document request (initial load)
  - Confirm CSP present once and directives as expected

## Troubleshooting

- Galaxy canvas blank (only in preview/prod)
  - Ensure CSP present and includes img-src data: blob: https:, worker-src blob: data:
  - Ensure no duplicate CSP headers (middleware is the single source of truth).

- Fonts or images blocked in prod
  - Update font-src/img-src to include https:/data:/blob: as needed in src/utils/security.ts
  - Add remote image domains to next.config.js images.domains

- Blocked scripts in prod
  - In current policy, 'unsafe-eval' is only allowed non-production.
  - Verify if any library needs eval in prod (ideally no). If so, revisit policy.

- ConvertKit script failing
  - Ensure ts-node or tsx installed, secrets set, and posts exist in src/posts.

- Lightning Network integration not responding
  - Ensure NOSTR_WALLET_CONNECT_URL is valid and reachable.
  - Check any API routes or websocket dependencies (connect-src allows wss:).

## Conventions and Local Preferences

- Git
  - Always include --no-pager for commands to avoid paging in Warp:
    - git --no-pager log --oneline -n 20
    - git --no-pager diff

- SSH
  - Personal SSH host ados-v01 is configured with IdentityFile ~/.ssh/id_rsa_gda_azdo (not directly used by this repo).

## Maintainer Notes and To-Dos

- Add dev dependency if using ConvertKit script:
  - npm i -D ts-node (or tsx) and add a package.json script if desired:
    - "broadcast:draft": "ts-node scripts/auto-broadcast.ts"

- Optional: Unify metadata URLs
  - Update layout.tsx openGraph url and images to use SITE_URL from src/utils/constants.ts

## Verification Checklist (first run)

- npm run dev boots on http://localhost:3000
- curl -I http://localhost:3000 shows security headers and a single CSP
- Homepage shows latest blog (if src/posts populated), sections, and animated background
