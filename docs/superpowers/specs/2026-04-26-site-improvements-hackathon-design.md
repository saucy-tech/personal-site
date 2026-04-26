# Site Improvements Hackathon (Mega Branch) Design

## Goal
Deliver a full-day, multi-agent implementation sprint that ships major net-new capabilities plus hardening/refactor improvements across SEO/discovery, conversion, reliability/security, and architecture maintainability.

## Constraints
- Use a single mega branch for implementation.
- Execute with multiple agents in parallel, grouped by independent tracks.
- Preserve existing Next.js App Router and TypeScript conventions.
- Keep quality gates strict to avoid regressions from parallel changes.

## Architecture
The sprint is organized into three parallel tracks with explicit seams:

1. **Track A (SEO + Conversion module)**  
   Extend structured data coverage for listing pages and add contextual subscribe copy/slot behavior for blog contexts.

2. **Track B (Reliability + Security module)**  
   Add automated security policy drift checks and strengthen endpoint guard consistency with test coverage.

3. **Track C (Architecture deepening module)**  
   Apply targeted deepening refactors to reduce shallow pass-through logic and improve locality/testability for content quality and runtime guards.

Each track can be developed independently, then integrated at checkpoints with full verification.

## Data and Control Flow
- Blog pages and archive-like routes emit route-specific metadata and JSON-LD through `src/utils/structured-data.ts`.
- Subscribe messaging becomes context-aware via typed props and contextual selectors.
- Security policy checks derive from `src/utils/security.ts` and are asserted via scripts used in CI.
- Refactor changes centralize content audit logic into deeper utility modules consumed by scripts and tests.

## Error Handling
- New validation and drift checks fail loudly in CI with actionable output.
- Runtime user-facing flows remain graceful (fallback copy, no hard crashes).
- Security check scripts return non-zero exit codes for policy drift.

## Testing Strategy
- Unit tests for new JSON-LD generation and security drift assertions.
- Targeted component tests for contextual subscribe behavior.
- Existing lint/test/build plus content/link/image checks at integration checkpoints.

## Delivery Strategy
- Parallel implementation by three agents in isolated worktrees.
- Integrate one track at a time into the mega branch.
- Run verification after each integration and one final full-suite pass at the end.

## Success Metrics
- Listing routes emit valid, richer JSON-LD.
- Contextual subscribe surfaces render expected copy by page context.
- Security drift checks run in CI and catch regressions.
- Reduced architectural friction in touched modules (clearer seams, less pass-through code).
