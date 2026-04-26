# Site Improvements Wave 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the first low-maintenance automation wave by adding content quality validation and CI guardrails that prevent silent regressions.

**Architecture:** Add a single script-driven validator for content quality checks and wire it into package scripts and CI. Keep checks deterministic, fast, and output-oriented so failures are actionable. Reuse existing post parsing/frontmatter plumbing to avoid duplicate validation logic.

**Tech Stack:** TypeScript, ts-node, Node fs/path, Next.js content utilities, GitHub Actions CI.

---

### Task 1: Add content quality validator script

**Files:**
- Create: `scripts/validate-content.ts`
- Test: `src/utils/posts.test.ts`

- [ ] **Step 1: Write the failing test**
Add a test in `src/utils/posts.test.ts` that asserts a new exported helper (from the script support path) flags invalid title/excerpt quality boundaries and accepts valid values.

- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm test -- --runInBand src/utils/posts.test.ts`  
Expected: FAIL because the quality validator helper does not exist yet.

- [ ] **Step 3: Write minimal implementation**
Implement `scripts/validate-content.ts` with:
- deterministic post scan over `src/posts/*.mdx`
- hard errors for invalid frontmatter parse failures
- quality checks:
  - title length in `[20, 72]`
  - excerpt length in `[90, 180]`
  - duplicate tags inside a post
  - missing tags warning
- non-zero exit code when hard errors exist; warnings printed but non-fatal.

- [ ] **Step 4: Run script and tests**
Run:
- `pnpm content:validate`
- `pnpm test -- --runInBand src/utils/posts.test.ts`
Expected: validator outputs summary and exits successfully on current content; targeted tests pass.

- [ ] **Step 5: Commit**
```bash
git add scripts/validate-content.ts src/utils/posts.test.ts package.json
git commit -m "chore(content): add automated content quality validator"
```

### Task 2: Wire validator into CI

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

- [ ] **Step 1: Add script command**
Add `content:validate` script to `package.json` using `ts-node --project tsconfig.scripts.json scripts/validate-content.ts`.

- [ ] **Step 2: Add CI step**
Insert a new CI step after dependency installation:
- name: `Validate content quality`
- run: `pnpm content:validate`

- [ ] **Step 3: Verify workflow locally**
Run:
- `pnpm content:validate`
- `pnpm lint`
Expected: validator passes and lint remains green.

- [ ] **Step 4: Commit**
```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: enforce content quality validation"
```

### Task 3: Document wave-1 usage

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update docs**
Add a concise section describing:
- what `pnpm content:validate` checks
- expected pass/fail behavior
- when to run it locally

- [ ] **Step 2: Validate docs + commands**
Run: `pnpm content:validate`  
Expected: documented command works exactly as written.

- [ ] **Step 3: Commit**
```bash
git add README.md
git commit -m "docs: document content validation workflow"
```
