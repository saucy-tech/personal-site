# Site refinements, September 22, 2026

The homepage leads with four active products: The Morning Portion, Train Every Day, The Home Hive, and Fitness Journal. The shared header has three destinations: Portfolio, About, and Notes. Client work stays under About and in the footer; Support stays in the footer. The Notes page combines current tools with Bitcoin and church links.

Writing, RSS, and the homepage newsletter invitation are no longer promoted. Existing article URLs remain available for inbound links. `/field-notes`, `/notebook`, and `/state-of-ai` redirect to `/notes`.

Current screenshots from the local production build:

- [Desktop homepage and header](home-desktop.jpg)
- [HomeHive and Fitness Journal](featured-additions.jpg)
- [Mobile homepage at 390 CSS pixels](home-mobile-dark.jpg)
- [Notes](notes-desktop.jpg)

## Product preview sources

Morning Portion and Train Every Day were captured from their public sites on September 22, 2026. Only the sanitized public workout demo was used.

HomeHive was captured from `https://home-hive-demo.brandonsauceda.workers.dev` on the same date. The page identifies its sample week, class, child, and lesson plan as invented. No private family app was opened.

Fitness Journal has no public interactive demo. Its screenshot was rendered locally from the code-only `templates/fitness-journal.html` in health-app at `0a2c30e3108724222e83c32dbab174b234309466`. Every measurement and goal was generated for this screenshot: 53 dates beginning August 1, a weight series `round(200 - i * .21 + sin(i) * .6, 1)`, its seven-day average, and eight weekly waist readings `round(38 - i * .2, 1)`. The goals are fictional too. Photo, scan, medication, training, and weekly-entry arrays are empty. The visible introduction labels the preview as fictional; the identifying title and medical context were replaced with neutral sample text. No iCloud records, private dashboard output, photos, or production API were read or copied. Only the reviewed WebP screenshot ships, not the local template or data files. The preview link opens that image.

## Verification

`pnpm check` passed: lint, TypeScript, 21 Jest suites / 135 tests. Production build, internal-link hygiene, image hygiene, and security drift checks passed. Existing warnings remain on older posts. Browser checks confirmed the three-link header, all four loaded product images, no horizontal overflow at desktop or 390 CSS pixels, and the old Notes URL redirect. The existing CI smoke test now covers Notes navigation rather than the removed homepage signup. No newsletter or payment action was submitted.
