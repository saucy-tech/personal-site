# Architecture Map

Generated: 2026-04-26T11:50:14.443Z

## App Routes

- `src/app/bitcoin/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/archive/[year]/[month]/page.tsx`
- `src/app/blog/category/[category]/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/series/[series]/page.tsx`
- `src/app/blog/series/page.tsx`
- `src/app/blog/tag/[tag]/page.tsx`
- `src/app/daily-word/page.tsx`
- `src/app/field-notes/page.tsx`
- `src/app/links/page.tsx`
- `src/app/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/support/page.tsx`
- `src/app/talks/page.tsx`

## API Routes

- `src/app/api/btcusd/route.ts`
- `src/app/api/csp-report/route.ts`
- `src/app/api/invoice/route.ts`
- `src/app/api/lnurlp/brandon/callback/route.ts`
- `src/app/api/subscribe/route.ts`
- `src/app/api/webmention/route.ts`

## Components

Total: 37

- `src/components/AppearanceToggle.tsx`
- `src/components/BlogArchive.tsx`
- `src/components/BlogImage.tsx`
- `src/components/BlogTitle.tsx`
- `src/components/ClientGalaxyBackground.tsx`
- `src/components/ClientSnowflakes.test.tsx`
- `src/components/ClientSnowflakes.tsx`
- `src/components/ClientTipJar.tsx`
- `src/components/GalaxyBackground.test.tsx`
- `src/components/GalaxyBackground.tsx`
- `src/components/LinkCard.tsx`
- `src/components/PageLayout.tsx`
- `src/components/PostTableOfContents.tsx`
- `src/components/Profile.test.tsx`
- `src/components/Profile.tsx`
- `src/components/ReadingProgress.tsx`
- `src/components/Section.tsx`
- `src/components/ShareButtons.tsx`
- `src/components/Snowflakes.tsx`
- `src/components/SocialBar.tsx`
- `src/components/SubscribeCard.tsx`
- `src/components/SubscribeForm.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/TipJar.tsx`
- `src/components/editorial/RankedItem.tsx`
- `src/components/editorial/ReportHeader.tsx`
- `src/components/editorial/ReportNav.tsx`
- `src/components/editorial/ReportSection.tsx`
- `src/components/editorial/TradeoffList.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/SiteNav.tsx`
- `src/components/loading.tsx`
- `src/components/shared/ErrorBoundary.tsx`
- `src/components/shared/ErrorFallback.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`

## Utilities

Total: 24

- `src/utils/constants.ts`
- `src/utils/content-quality.test.ts`
- `src/utils/content-quality.ts`
- `src/utils/frontmatter-schema.test.ts`
- `src/utils/frontmatter-schema.ts`
- `src/utils/helpers.test.ts`
- `src/utils/helpers.ts`
- `src/utils/image-hygiene.test.ts`
- `src/utils/image-hygiene.ts`
- `src/utils/link-hygiene.test.ts`
- `src/utils/link-hygiene.ts`
- `src/utils/lnurl-config.ts`
- `src/utils/logger.ts`
- `src/utils/nwc-client.ts`
- `src/utils/post-taxonomy.ts`
- `src/utils/posts.test.ts`
- `src/utils/posts.ts`
- `src/utils/security-monitor.ts`
- `src/utils/security.test.ts`
- `src/utils/security.ts`
- `src/utils/structured-data.test.ts`
- `src/utils/structured-data.ts`
- `src/utils/theme.ts`
- `src/utils/tipjar.ts`

## Regeneration

- Run `pnpm docs:architecture` whenever app routes/util boundaries change.
