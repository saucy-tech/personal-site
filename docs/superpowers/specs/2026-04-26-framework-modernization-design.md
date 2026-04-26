# Framework Modernization and Upgrade Safety Design

## Goal
Modernize framework/tooling dependencies with a test-first strategy that minimizes regression risk and provides strong confidence before merge.

## Context
The project already uses modern versions of Next.js, React, TypeScript, and pnpm-driven CI checks. The main risk now is not "being outdated," but introducing subtle behavior drift during framework/toolchain updates.

## Modernization Opportunities

### 1. Framework and runtime upgrade workflow
- Establish a repeatable dependency upgrade cadence (monthly batch).
- Use a dedicated upgrade branch with strict quality gates before merge.
- Prefer incremental updates (tooling first, runtime second) over broad jumps.

### 2. Contract-focused test coverage expansion
- Expand API contract tests for:
  - `src/app/api/subscribe/route.ts`
  - `src/app/api/invoice/route.ts`
  - `src/app/api/btcusd/route.ts`
- Strengthen rendering/metadata invariants for archive and post pages.
- Add smoke journey coverage in Playwright for main content and subscribe path.

### 3. Type/lint modernization in controlled phases
- Evaluate stricter TypeScript checks (incremental opt-in).
- Adopt lint rule upgrades only with explicit autofix + review checkpoints.

### 4. Build and security drift resilience
- Keep security policy assertions as hard CI gate.
- Keep content/link/image hygiene checks and quality gate consolidated.

## Break Risk Assessment

### High Risk
- Next.js major changes: metadata behavior, route rendering mode, cache semantics.
- React major shifts: hydration/client boundary timing behavior.

### Medium Risk
- Test runner ecosystem updates (Jest and environment packages).
- ESLint major/rule changes causing broad code churn.

### Lower Risk
- Minor utility dependency upgrades with stable APIs.

## Risk Mitigations
- Test-first contracts for each affected behavior before dependency changes.
- Slice-by-slice upgrades with isolated validation between slices.
- Clear rollback point after each slice (single revertable commit group).
- No simultaneous runtime + tooling major jumps in one step.

## Test Design Principles (TDD)
- Every behavior change starts with a failing test.
- Contract tests target externally visible behavior, not implementation details.
- Keep test names scenario-based and outcome-specific.
- Separate tests by level:
  - Unit contracts (utils/serializers/security)
  - API route contracts (status/body/error)
  - Integration smoke (Playwright)

## Proposed Upgrade Slices
1. **Safety net slice**: add/strengthen tests and baseline snapshots (no dependency changes).
2. **Tooling slice**: lint/test toolchain updates and config migration.
3. **Runtime slice**: Next.js/React aligned upgrades (if needed), one major risk area at a time.
4. **Hardening slice**: remove temporary compat shims, update docs/runbooks.

## Success Criteria
- All `quality:gate` checks pass.
- Build passes on CI and local.
- New contract tests detect intentional break simulations.
- No behavior regressions in core routes and APIs.
