# saucy.tech

**Brandon Sauceda's personal site — portfolio, blog, and the Daily Word devotion archive.**

Live at [saucy.tech](https://saucy.tech). Next.js 16 on the App Router, deployed to Cloudflare Workers through the OpenNext adapter. Content is MDX in this repo, compiled to a static data module at build time. Clone it and `pnpm dev` — nothing external is required to run the site locally.

## Why

The things I build live in different places: products on their own domains, open-source work in other people's repos, writing in an email list. This site is the one address that holds the record of all of it, and it is deliberately not rented from a platform — the feed, the subscribe endpoint, the webmention receiver, and the Lightning tip address are all routes in this repo, running on infrastructure I control.

## What's on it

| Route | What it is |
|---|---|
| `/` | Landing page — profile, sections, link cards |
| `/portfolio` | Products, tools, open-source contributions, and talks (content in `src/data/projects.ts`) |
| `/blog` | Posts, with archive, category, series, and tag indexes |
| `/daily-word` | Archive of weekday scripture reflections |
| `/about` | Background |
| `/bitcoin`, `/links` | Bitcoin resources and a set of trackers and dashboards |
| `/support` | Lightning tips and email subscription |
| `/oura-health` | Disclosure page for a private Oura health-data integration, plus its privacy and terms pages |

API routes under `src/app/api/`: BTC price proxy, Lightning invoice and LNURL-pay callback, email subscribe, webmention receiver, and a CSP violation report sink. RSS at `src/app/rss.xml`, sitemap at `src/app/sitemap.ts`.

## Run it

Requires Node and pnpm 10 (pinned via Corepack in `package.json`).

```bash
git clone https://github.com/saucy-tech/personal-site.git
cd personal-site
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:3000. No environment variables are needed for the site to render; the Lightning and subscribe routes stay inert until the vars below are set.

## Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19, TypeScript 6
- **Styling** — Tailwind CSS 4 with `@tailwindcss/typography`; dark mode via a theme toggle
- **Content** — MDX files in `src/posts/`, frontmatter parsed by `gray-matter`, rendered through a remark/rehype pipeline (`remark-gfm`, `rehype-slug`, `rehype-autolink-headings`)
- **Animation** — Framer Motion
- **Payments** — Lightning via the Alby SDK over Nostr Wallet Connect
- **Testing** — Jest and React Testing Library, Playwright for E2E
- **Hosting** — Cloudflare Workers via the [OpenNext adapter](https://opennext.js.org/cloudflare)

## Content pipeline

Posts are not rendered at request time. `pnpm gen:posts` runs `scripts/generate-posts-data.ts`, which reads every MDX file in `src/posts/`, converts it to HTML through remark/rehype, and writes `src/utils/posts-data.generated.ts`. `pnpm build` runs that first, so the generated module is always in step with the MDX. Edit the MDX, not the generated file.

`src/posts/` is an archive. New devotions are authored in the `the-morning-portion` repo; posts here are left as-is unless there is a reason to change them.

## Quality gate

`pnpm quality:gate` is the check to run before pushing. CI runs the same command, then build and E2E smoke tests. It covers:

```
pnpm lint
pnpm test
pnpm content:validate      # post frontmatter: title and excerpt length, tag hygiene
pnpm content:check-links   # internal /blog links and referenced images exist
pnpm content:check-images  # alt text present, local images resolve, size limits
pnpm security:drift        # production CSP has not regressed
```

## Deploy

Cloudflare Workers Builds deploys on push through the Git integration: branches get preview URLs, merges to `main` go to production. Manual deploy:

```bash
pnpm deploy
```

## Operations

### Content Security Policy

The CSP is generated per request in [`src/middleware.ts`](src/middleware.ts) from [`src/utils/security.ts`](src/utils/security.ts), so local dev and the Worker behave the same way. The policy branches on `NODE_ENV`, not on hosting-platform variables: `next dev` allows `'unsafe-eval'` for React Refresh, and every other environment — including anything unrecognized — fails closed to the strict policy, which drops `'unsafe-eval'` and adds `upgrade-insecure-requests`.

That branch used to key on `VERCEL`/`VERCEL_ENV`, which do not exist on Cloudflare Workers, so production quietly served the development policy after the migration until it was caught on 2026-06-12. Platform-specific environment detection is the failure mode to avoid here.

`pnpm security:drift` forces the production branch and fails if `'unsafe-eval'` reappears or `upgrade-insecure-requests` goes missing; `src/utils/security.test.ts` pins both branches. Add new external origins to the explicit directives in `src/utils/security.ts` — do not add a second CSP via `next.config.js` or a meta tag, and do not reintroduce `'unsafe-eval'` to fix a blocked script.

Verify with `curl -sI https://saucy.tech | grep -i content-security-policy`, or `pnpm preview` and the same curl against http://localhost:8787.

### Devotion broadcast

Merging a post does not email anyone. The email to the Daily Word list is sent only by manually dispatching `.github/workflows/devotion-broadcast.yml` (Actions → Run workflow), supplying the post slug and typing `SEND` in the confirm field. It uses the `KIT_API_KEY` secret and the `NEXT_PUBLIC_APP_URL` variable. The PR-label trigger was removed on 2026-06-10 so a stray `devotion` label can never send mail from this archive. `pnpm broadcast` is a manual fallback that creates a draft from the latest post by frontmatter date.

### Résumé PDF

`/Brandon_Sauceda_Resume.pdf` in `public/` is copied from the Career-Dev packet and regenerated there, not edited here.

### Seasonal features

The falling-snow animation is winter-only and is not in the active layout. The components are kept at `src/components/Snowflakes.tsx` and `src/components/ClientSnowflakes.tsx`; to bring it back, import `ClientSnowflakes` in `src/app/layout.tsx` and render it after `<ClientGalaxyBackground />`.

### Environment variables

None are required to run the site locally. Set these to exercise the corresponding routes:

```bash
NOSTR_WALLET_CONNECT_URL=      # required for Lightning invoices
LNURL_MIN_SENDABLE=1000        # optional LNURL-pay tuning
LNURL_MAX_SENDABLE=1000000000
LNURL_COMMENT_ALLOWED=280
LNURL_METADATA_TEXT=
LNURL_METADATA_DESC=

NEXT_PUBLIC_APP_URL=           # site URL, used for OpenGraph and absolute links
SITE_URL=                      # optional canonical override

CONVERTKIT_API_KEY=            # email subscription
CONVERTKIT_FORM_ID=
CK_SECRET_KEY=                 # only for the `pnpm broadcast` fallback
CK_PUBLISHER_ID=

UPSTASH_REDIS_REST_URL=        # optional distributed rate limiting
UPSTASH_REDIS_REST_TOKEN=
ENABLE_CSP_VIOLATION_REPORTS=0 # optional CSP reporting toggles
CSP_REPORT_ONLY=0
SENTRY_DSN=                    # optional error monitoring
```

Runbooks live in [`docs/`](./docs).

## Contributing

It is my personal site, so I am not looking for features — but if something is broken, an issue or a PR is welcome. Run `pnpm quality:gate` before pushing.

## License

MIT.
