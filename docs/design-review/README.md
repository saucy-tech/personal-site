# Site refinements, September 22, 2026

The homepage leads with four active products: The Morning Portion, Train Every Day, The Home Hive, and Health Dashboard. The shared header has three destinations: Portfolio, About, and Notes. Client work stays under About and in the footer; Support stays in the footer. The Notes page combines current tools with Bitcoin and church links.

Writing, RSS, and the homepage newsletter invitation are no longer promoted. Existing article URLs remain available for inbound links. `/field-notes`, `/notebook`, and `/state-of-ai` redirect to `/notes`.

Current screenshots from the local production build:

- [Desktop homepage and header](home-desktop.jpg)
- [HomeHive and Fitness Journal](featured-additions.jpg)
- [Mobile homepage at 390 CSS pixels](home-mobile-dark.jpg)
- [Notes](notes-desktop.jpg)

## Product preview sources

Morning Portion and Train Every Day were captured from their public sites on September 22, 2026. Only the sanitized public workout demo was used.

HomeHive was captured from `https://home-hive-demo.brandonsauceda.workers.dev` on the same date. The page identifies its sample week, class, child, and lesson plan as invented. No private family app was opened.

Health Dashboard was captured from `https://health-app-demo.brandonsauceda.workers.dev` on September 22, 2026, at a 1147x676 viewport and 1.5x scale, then cropped to 1720x1014. That demo is built by `demo/build_demo.py` in health-app: the real emitter and pages run over records invented by `demo/generate_records.py`, the shared code's identifying strings are rewritten, and the build fails if a scan of the output finds a private term, email address, Access domain, or account id. Progress photos are drawn silhouettes. No iCloud records, private dashboard output, photos, or production API were read or copied. It replaces the earlier Fitness Journal screenshot.

## Verification

`pnpm check` passed: lint, TypeScript, 21 Jest suites / 135 tests. Production build, internal-link hygiene, image hygiene, and security drift checks passed. Existing warnings remain on older posts. Browser checks confirmed the three-link header, all four loaded product images, no horizontal overflow at desktop or 390 CSS pixels, and the old Notes URL redirect. The existing CI smoke test now covers Notes navigation rather than the removed homepage signup. No newsletter or payment action was submitted.
