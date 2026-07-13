# Implementation Notes — PR 272 Revision

**Spec:** Conversation approving the support-only revision of https://github.com/saucy-tech/personal-site/pull/272
**Started:** 2026-07-13
**Status:** complete

## How to read this file

Running log of decisions, deviations, and tradeoffs made while implementing the spec. Entries are append-only and chronological. Each entry names the spec section it relates to so you can diff intent vs. shipped code.

## Decisions not covered by the spec

### Rewrite the existing PR from `main` — 2026-07-13
**Spec section:** Better PR structure
PR 272 is being rebuilt as a support-only change instead of retaining the abandoned domain-split commits. A local backup branch preserves the previous head, and the remote update will use force-with-lease so unexpected remote changes cannot be overwritten.

### Use email as the private handoff — 2026-07-13
**Spec section:** Keep the Trump Account change separate
The page will offer a pre-addressed email action rather than publishing another contribution URL or relying on vague “message me” copy. This uses the same public contact address already shown throughout the site and gives visitors a concrete next step.

### Match the existing family-savings language — 2026-07-13
**Spec section:** Keep the Trump Account change separate
The new heading will use “My Son” rather than adding the child’s name to the public page. This matches the adjacent 529 section, keeps the presentation restrained, and avoids publishing an unnecessary personal identifier.

## Deviations from the spec

## Tradeoffs accepted

### The exposed contribution link still requires external rotation — 2026-07-13
**Spec section:** Keep the Trump Account change separate
Rewriting the PR removes the secret-bearing commit from the active branch history, but it cannot revoke a link already published in GitHub commit and review history. Rotation must happen through the contribution provider and remains an owner follow-up.

## Surprises and gotchas

## Open questions for review

- Confirm that the previously exposed contribution link has been rotated or invalidated before merging.
