# Framework Modernization TDD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an upgrade safety net with contract-driven tests first, then modernize frameworks/tooling in low-risk slices.

**Architecture:** Establish immutable behavioral contracts before dependency upgrades, then perform upgrades in isolated slices with full gate validation between slices.

**Tech Stack:** Next.js App Router, React, TypeScript, Jest, Playwright, pnpm, GitHub Actions.

---

### Task 1: Baseline contract inventory and test matrix

**Files:**
- Create: `docs/testing/framework-upgrade-test-matrix.md`
- Modify: `README.md`

- [x] **Step 1: Write the test matrix document**
Define contracts by surface:
- API: expected status/body/error behavior for `subscribe`, `invoice`, `btcusd`
- Rendering: JSON-LD and metadata invariants for blog routes
- Security: required headers/CSP directives
- Content pipeline: validate/link/image checks
- Smoke journey: home -> blog -> post -> subscribe flow

- [x] **Step 2: Add baseline command documentation**
Document the exact baseline command set:
- `pnpm quality:gate`
- `pnpm build`
- `pnpm test:e2e`

- [x] **Step 3: Verify docs consistency**
Run: `pnpm quality:gate`
Expected: pass with current warning profile.

### Task 2: API contract tests first (RED -> GREEN)

**Files:**
- Modify: `src/app/api/subscribe/route.test.ts`
- Modify: `src/app/api/invoice/route.test.ts`
- Modify: `src/app/api/btcusd/route.test.ts`

- [x] **Step 1: Add one failing contract test per route**
Examples:
- subscribe rejects malformed payload with stable error shape
- invoice enforces guardrails with stable status/message
- btcusd returns stable numeric payload contract

- [x] **Step 2: Run targeted tests and confirm RED**
Run:
- `pnpm test -- --runInBand src/app/api/subscribe/route.test.ts`
- `pnpm test -- --runInBand src/app/api/invoice/route.test.ts`
- `pnpm test -- --runInBand src/app/api/btcusd/route.test.ts`
Expected: new tests fail for missing or mismatched behavior.

- [x] **Step 3: Implement minimal production adjustments**
Only if needed to satisfy explicit contract behavior.

- [x] **Step 4: Re-run targeted tests and confirm GREEN**
All new contract tests pass.

### Task 3: Rendering and metadata invariants first (RED -> GREEN)

**Files:**
- Modify: `src/utils/structured-data.test.ts`
- Create: `src/app/blog/blog-metadata-contract.test.ts` (or colocated equivalent)

- [x] **Step 1: Add failing tests for JSON-LD/metadata invariants**
Cover post and archive routes:
- required `@type` values
- canonical URLs
- breadcrumb and item list expectations

- [x] **Step 2: Run targeted tests and confirm RED**
Run: `pnpm test -- --runInBand src/utils/structured-data.test.ts src/app/blog/blog-metadata-contract.test.ts`

- [x] **Step 3: Implement minimal fixes where contracts are missing**

- [x] **Step 4: Re-run targeted tests and confirm GREEN**

### Task 4: E2E smoke coverage for upgrade-critical journeys

**Files:**
- Modify/Create: `tests/e2e/smoke.spec.ts` (or current Playwright location)

- [ ] **Step 1: Add failing smoke assertions**
Test user-visible invariants:
- homepage loads with expected key section
- blog index loads and links to a post
- post renders and subscribe interaction is visible/usable

- [ ] **Step 2: Run smoke test and confirm RED**
Run: `pnpm test:e2e --grep smoke`

- [ ] **Step 3: Implement minimal fixes**

- [ ] **Step 4: Re-run smoke test and confirm GREEN**

### Task 5: Toolchain modernization slice

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: config files only if required (`eslint.config.mjs`, `jest.config.js`, `tsconfig*.json`)

- [ ] **Step 1: Upgrade one toolchain cluster**
Prefer one cluster at a time (example: ESLint-related updates only).

- [ ] **Step 2: Run full verification gate**
Run:
- `pnpm quality:gate`
- `pnpm build`
- `pnpm test:e2e --grep smoke`
Expected: all pass.

- [ ] **Step 3: Commit the slice**
Use a focused message like:
- `chore(tooling): modernize eslint stack with contract-safe baseline`

### Task 6: Framework/runtime modernization slice

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: runtime code only if compatibility requires it

- [ ] **Step 1: Upgrade framework/runtime cluster**
Update Next.js/React only when toolchain slice is green.

- [ ] **Step 2: Run full verification gate**
Run:
- `pnpm quality:gate`
- `pnpm build`
- `pnpm test:e2e --grep smoke`
Expected: all pass with no contract regressions.

- [ ] **Step 3: Apply minimal compatibility fixes if tests fail**
Fix strictly by failing contracts.

- [ ] **Step 4: Re-run gate to GREEN**

### Task 7: Final hardening and docs

**Files:**
- Modify: `README.md`
- Modify: `docs/runbooks/api-incident-response.md`
- Modify: `docs/runbooks/content-guardrails.md`

- [ ] **Step 1: Document final upgrade workflow**
Include:
- cadence
- required gates
- rollback procedure

- [ ] **Step 2: Final full verification**
Run:
- `pnpm quality:gate`
- `pnpm build`
- `pnpm test:e2e --grep smoke`

- [ ] **Step 3: Prepare branch completion options**
Use finishing workflow after all checks are green.
