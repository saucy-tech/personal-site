# Site Improvements Portfolio (Option 1) — Design

## Goal
Ship an extensive 30-day set of improvements across SEO, conversion, reliability, security, performance, and DX while minimizing ongoing maintenance burden through automation and guardrails.

## Constraints
- Favor low-maintenance, automatable changes over ongoing manual processes.
- Keep rollout in small, reviewable PR-sized increments.
- Reuse existing stack and patterns (Next.js App Router, TypeScript, pnpm, Jest, Playwright, GitHub Actions, Sentry, Vercel).

## Architecture
The improvement program is a portfolio of independent units:
- Content quality automation (pre-publish and CI checks).
- Discovery/SEO hardening (schema and link hygiene).
- Conversion plumbing with config-driven CTA slots.
- Reliability and observability guardrails in CI and runtime.
- Security drift checks and endpoint abuse protections.

Each unit is designed to be additive, independently deployable, and testable without large cross-cutting refactors.

## 30-Day Scope

### 1. Content and Publishing Automation
- Add a content quality validator script for frontmatter and copy constraints (title/excerpt quality, tag hygiene, metadata consistency).
- Fail CI for objectively broken content; warn for soft-quality issues.
- Keep authoring workflow simple: one command validates all posts.

### 2. SEO and Discovery
- Expand structured data support for blog/article and site-level entities.
- Add internal-link hygiene checks to catch broken references and orphaned content.
- Ensure metadata consistency for canonical, RSS, and sitemap surfaces.

### 3. Conversion Paths
- Introduce config-driven CTA slots to enable copy/location tests with minimal code changes.
- Add contextual subscribe prompts by content context (e.g., category/tag).
- Standardize “work with me” path on high-intent pages.

### 4. Performance and UX
- Enforce practical Lighthouse thresholds in CI for key routes.
- Add image hygiene checks (size/alt expectations) and route-level loading polish.
- Prefer low-cost changes that reduce regressions over heavy tuning.

### 5. Reliability and Observability
- Expand automated checks for high-value routes and APIs.
- Improve error/latency visibility with existing telemetry integrations.
- Add runbooks for common failure classes.

### 6. Security and Abuse Resistance
- Add CI assertions for security header/CSP drift.
- Harden request guard behavior consistency on public endpoints.
- Keep policy centralized in existing security utilities/proxy path.

### 7. DX and Maintainability
- Consolidate operational knobs into explicit config points.
- Add a single “definition of done” validation path for local + CI use.
- Document architecture and ownership boundaries to reduce cognitive load.

## Delivery Strategy
- Week 1: content validator, security/CSP assertions, initial CTA config scaffolding.
- Week 2: schema expansion, contextual subscription prompts, endpoint reliability checks.
- Week 3: Lighthouse thresholds, image hygiene automation, conversion path improvements.
- Week 4: observability polish, architecture docs generation, KPI review.

## Success Metrics
- SEO: indexed/discoverable content quality and click-through trend.
- Conversion: subscriber and contact CTA conversion by route type.
- Reliability: CI pass stability, endpoint error rate, smoke/e2e stability.
- Performance: Lighthouse pass rates and core route performance trends.
- Maintenance: reduced manual intervention for content and release checks.
