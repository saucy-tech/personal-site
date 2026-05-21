# Implementation Notes — Portfolio Hiring Gap Fixes

**Spec:** `docs/superpowers/plans/2026-05-21-portfolio-hiring-gap-fixes.md`
**Started:** 2026-05-21
**Status:** complete

## How to read this file

Running log of decisions, deviations, and tradeoffs made while implementing the spec. Entries are append-only and chronological. Each entry names the spec section it relates to so you can diff intent vs. shipped code.

## Decisions not covered by the spec

### Resume PDF source — 2026-05-21
**Spec section:** Task 1
`Brandon_Sauceda_Resume_ATS.pdf` does not exist in Career-Dev yet. Copied `v2_Concise_ATS_PLAIN.pdf` to `public/Brandon_Sauceda_Resume.pdf` per plan fallback. Replace when Career-Dev resume plan Task 10 completes.

## Deviations from the spec

### Playwright résumé assertion — 2026-05-21
**Spec section:** Task 8
Plan used `/résumé/i`, which matches three links on `/portfolio` (hero, gov-tech card, footer). Assert hero CTA by name `Download résumé (PDF)` instead. Scoped email/LinkedIn checks to `#main-content` to avoid footer duplicate strict-mode violations.

## Tradeoffs accepted

### Task 10 deferred — 2026-05-21
**Spec section:** Task 10 (optional P2)
Project screenshots deferred per plan.


## Surprises and gotchas

<!-- Things the reader/reviewer should know that aren't obvious from the diff -->

## Open questions for review

<!-- Items where you'd like Brandon's eyes before merge -->
