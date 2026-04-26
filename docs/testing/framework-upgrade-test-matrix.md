# Framework Upgrade Test Matrix

## Purpose
Define the minimum contract suite that must pass before and after framework/toolchain upgrades.

## Baseline Commands
- `pnpm quality:gate`
- `pnpm build`
- `pnpm test:e2e --grep smoke`

## Contract Surfaces

### API Contracts
- `src/app/api/subscribe/route.test.ts`
  - malformed payload rejection shape
  - successful subscription response shape
- `src/app/api/invoice/route.test.ts`
  - guardrail enforcement for invalid amount/memo
  - successful invoice creation shape
- `src/app/api/btcusd/route.test.ts`
  - stable payload schema and numeric value guarantees

### Rendering and Metadata Contracts
- `src/utils/structured-data.test.ts`
  - post JSON-LD (`BlogPosting`) shape
  - archive JSON-LD (`CollectionPage` and `ItemList`) shape
- route-level metadata invariants (post, tag, category)
  - canonical URLs
  - OG URL/title expectations

### Security Contracts
- `src/utils/security.test.ts`
  - required security headers exist
  - required CSP directive fragments exist
- `pnpm security:drift`
  - drift detection script fails on policy regressions

### Content Contracts
- `pnpm content:validate`
- `pnpm content:check-links`
- `pnpm content:check-images`

### User Journey Smoke Contracts (Playwright)
- Home page loads expected hero/content blocks.
- Blog index loads and links to a post.
- Post page renders and subscribe interaction is available.

## Upgrade Slice Policy
1. Add or tighten contracts first (tests must fail when behavior breaks).
2. Upgrade one dependency cluster at a time.
3. Re-run baseline commands after each cluster.
4. If any contract fails, fix behavior or revert the cluster before continuing.

## Rollback Rule
If a slice cannot pass all baseline commands with reasonable compatibility fixes, revert that slice and continue with lower-risk upgrades.
