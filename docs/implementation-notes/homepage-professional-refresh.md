# Implementation Notes — Homepage Professional Refresh

**Spec:** Conversation request on 2026-07-13 to make the homepage more professional, feature The Morning Portion as the flagship product, and stop presenting the migrated Daily Word archive as the latest post
**Started:** 2026-07-13
**Status:** complete

## How to read this file

Running log of decisions, deviations, and tradeoffs made while implementing the spec. Entries are append-only and chronological. Each entry names the spec section it relates to so you can diff intent vs. shipped code.

## Decisions not covered by the spec

### Keep the homepage refresh separate from PR 272 — 2026-07-13
**Spec section:** Professional homepage
The support-page change remains a focused PR. This homepage work will ship as a separate draft PR so the editorial and navigation decisions can be reviewed independently.

### Remove the automated latest-post card for now — 2026-07-13
**Spec section:** Latest post
The current newest local posts are Daily Word entries that now belong to The Morning Portion. The homepage will keep a general Writing destination but will not label an archived entry as the latest post until new personal-site writing resumes.

### Preserve the existing visual system — 2026-07-13
**Spec section:** Professional homepage
This is a hierarchy and copy refinement, not a visual redesign. The existing profile, social bar, LinkCard, Section, color themes, and narrow layout remain in place while the content order and wording become more focused.

### Reuse the official Morning Portion mark — 2026-07-13
**Spec section:** Flagship product
The flagship card will use the existing Morning Portion icon from the product repository rather than an emoji or newly invented artwork. This makes the product visually distinct while keeping its established brand intact.

## Deviations from the spec

## Tradeoffs accepted

### No new article is part of this change — 2026-07-13
**Spec section:** Latest post
The user noted that a new post probably needs to be written but did not request article creation in this pass. The homepage will avoid stale recency claims without inventing or rushing new editorial content.

## Surprises and gotchas

## Open questions for review
