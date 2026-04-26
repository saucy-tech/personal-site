# Site Improvements Hackathon Mega Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship major multi-track site improvements in one mega branch using parallel agent execution and strict verification gates.

**Architecture:** Execute three independent tracks in isolated worktrees and integrate them into one branch with checkpoint verification. Each track owns specific files and tests to minimize overlap and merge risk.

**Tech Stack:** Next.js App Router, TypeScript, Jest, pnpm scripts, GitHub Actions.

---

### Task 1: Track A - SEO and contextual conversion improvements

**Files:**
- Modify: `src/utils/structured-data.ts`
- Modify: `src/utils/structured-data.test.ts`
- Modify: `src/components/SubscribeCard.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/blog/tag/[tag]/page.tsx`
- Modify: `src/app/blog/category/[category]/page.tsx`

- [ ] **Step 1: Write failing tests for new structured data output**
- [ ] **Step 2: Implement listing-page JSON-LD helpers and route usage**
- [ ] **Step 3: Add contextual subscribe copy inputs and wire blog contexts**
- [ ] **Step 4: Run `pnpm test -- --runInBand src/utils/structured-data.test.ts`**
- [ ] **Step 5: Run `pnpm lint`**
- [ ] **Step 6: Commit**

### Task 2: Track B - Security and reliability guardrails

**Files:**
- Create: `scripts/check-security-drift.ts`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `src/utils/security.ts`
- Modify: `src/utils/security.test.ts`

- [ ] **Step 1: Write failing tests for security drift assertion helper**
- [ ] **Step 2: Implement reusable security policy assertion + script**
- [ ] **Step 3: Wire `security:drift` script into package scripts and CI**
- [ ] **Step 4: Run `pnpm test -- --runInBand src/utils/security.test.ts`**
- [ ] **Step 5: Run `pnpm security:drift`**
- [ ] **Step 6: Commit**

### Task 3: Track C - Architecture deepening refactor

**Files:**
- Modify: `src/utils/content-quality.ts`
- Modify: `src/utils/content-quality.test.ts`
- Modify: `scripts/validate-content.ts`
- Modify: `scripts/check-internal-links.ts`
- Modify: `scripts/check-image-hygiene.ts`

- [ ] **Step 1: Extract a deeper content-audit module seam in `src/utils/content-quality.ts`**
- [ ] **Step 2: Update tests to exercise interface behavior, not implementation details**
- [ ] **Step 3: Switch scripts to consume the deepened module interface**
- [ ] **Step 4: Run `pnpm test -- --runInBand src/utils/content-quality.test.ts`**
- [ ] **Step 5: Run `pnpm content:validate && pnpm content:check-links && pnpm content:check-images`**
- [ ] **Step 6: Commit**

### Task 4: Integration checkpoint verification

**Files:**
- Modify: (none expected, unless merge conflict resolutions are required)

- [ ] **Step 1: Cherry-pick all track commits onto `feature/hackathon-mega-wave`**
- [ ] **Step 2: Resolve conflicts and re-run impacted tests**
- [ ] **Step 3: Run `pnpm lint`**
- [ ] **Step 4: Run `pnpm test`**
- [ ] **Step 5: Run `pnpm build`**
- [ ] **Step 6: Run `pnpm content:validate && pnpm content:check-links && pnpm content:check-images && pnpm security:drift`**
- [ ] **Step 7: Commit integration fixes if needed**
