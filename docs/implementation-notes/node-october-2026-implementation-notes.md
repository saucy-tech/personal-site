# Implementation Notes — October 2026 Node security remediation

**Spec:** Brandon's 2026-10-21 repository remediation brief (thread)
**Started:** 2026-10-21
**Status:** local acceptance complete; remote verification pending

## How to read this file

Chronological decisions and evidence for the security changes. The release
runbook records the final graph, verification, and production approval gates.

## Decisions not covered by the spec

### Keep the existing framework and package manager — 2026-10-21
**Spec section:** Common implementation and authority
The clean bound worktree starts at freshly fetched `origin/main`
`a71d2888dc51fc574f773ea4af65649ef74335c7`. Next 16.4.2, React 19.3.1,
OpenNext 1.20.12, Wrangler 4.151.1, and pnpm 10.15.0 are the baseline.
The Node 24.22.1 runner is temporary and checksummed against nodejs.org;
it does not change the host's default Node or pnpm installation.

### Use same-major Undici overrides without a parent upgrade — 2026-10-21
**Spec section:** Common implementation and authority
Wrangler 4.151.1 pins Miniflare 5.20261012.1-beta, which pins Undici 7.29.1.
The latest Wrangler 4.151.3 still pins Undici 7.29.1 through Miniflare
5.20261019.1-beta. Regenerating with pnpm 10.15.0 changes only the Undici
7.30.1 resolution and the overrides; the existing 6.29.1 resolution remains.
Both override floors are bounded to their original majors.

### Extend Worker coverage and isolate the price fixture — 2026-10-21
**Spec section:** Owned checks
The existing Worker smoke now covers the requested content routes and
prerendered OG/static images, catching adapter startup or asset regressions
after the Node major-line change. The existing unconfigured-Lightning E2E
test mocks the browser's BTC price request so it cannot depend on Coinbase.
Successful Kit operations remain covered by the existing mocked unit tests.

## Deviations from the spec

## Tradeoffs accepted

### Keep the provider runtime boundary explicit — 2026-10-21
**Spec section:** Source facts / release safety boundaries
Node 24.22.1 patches the build/dev process and its bundled Undici; the
Cloudflare edge runtime and local workerd native libraries are separately
maintained. Keep the existing runtime compatibility settings and document
the provider patch-status gap rather than claiming the Node pin patches them.

## Surprises and gotchas

### Local instructions are ignored and absent from new worktrees — 2026-10-21
**Spec section:** Read first and verify / PR contract
No AGENTS.md or CLAUDE.md exists in the bound worktree. Read the originals
for orientation without changing that checkout. Their draft-PR policy applies;
the brief explicitly requests repository policy, overriding file-pr's usual
ready-PR default. Signing remains required by the brief.

### Browser and Builds API need separate fallbacks — 2026-10-21
**Spec section:** Repository-specific preview verification
T3 preview opened, but two snapshot calls timed out. Chrome's supported
browser interface provides authenticated dashboard inspection. Existing
Wrangler OAuth can read Worker settings and versions but receives HTTP 403
from the Builds trigger API, so build settings must be inspected in the UI.

### Baseline behavior verified before dependency edits — 2026-10-21
**Spec section:** Common implementation and authority
The original graph passes quality:gate and the production Next build on the
available Node 26.12.0. Local production-server requests verify home,
portfolio, about, notes, blog/article, RSS, sitemap, 404, and subscribe GET
(405); desktop/mobile homepage screenshots establish the visual baseline.
Node 24.22.1 frozen install preserves the original lockfile for the next pass.

### Original graph also passes under Node 24 — 2026-10-21
**Spec section:** Common implementation and authority
Quality gate (18 suites, 128 tests), production Next build, explicit
TypeScript check, and the original Worker smoke pass on Node 24.22.1 before
dependency edits. Worker sitemap GET logs an attempted write to the existing
read-only incremental cache while returning 200. This precedes the fix; keep
the cache configuration and record the limitation instead of hiding the log.

### Audit and optional peer results require separate classification — 2026-10-21
**Spec section:** Source facts
Baseline full audit reports only the existing unpatched braces advisory
GHSA-vfj7-8cjw-p6xm; production audit reports zero. Neither audit reports the
installed vulnerable Undici, so the official advisory and resolved graph are
the remediation evidence. Lockfile regeneration also reports the existing
optional schema-utils 4.8.1 / webpack 5.106.2 peer mismatch. Both packages and
their lockfile entries are unchanged; do not suppress this warning.

### No Cloudflare override needs changing — 2026-10-21
**Spec section:** Repository-specific contract
The dashboard shows a legacy shared build configuration with no build
variables or secrets, including no NODE_VERSION override. Production's
successful build log confirms Node 25.9.0 / pnpm 10.15.0 at main a71d2888.
The checked-in .nvmrc therefore supplies the preview change and the future
production change on approved merge; no external build setting was edited.

### Final local checks use the patched graph — 2026-10-21
**Spec section:** Owned checks
Frozen install, quality gate (18 suites / 128 tests), production Next build,
explicit TypeScript check, and all 13 existing Playwright E2E tests pass
on Node 24.22.1 / pnpm 10.15.0. A synthetic local HTTP-response check passes
for bundled Undici 7.30.1 and npm Undici 6.29.1 / 7.30.1. Manifest/lockfile
override equality, YAML uniqueness, Actions' .nvmrc selection, and the full
affected-package graph also pass inspection. Full/production audits retain
the baseline one-high/zero split; no audit-ignore setting was added.

### OG checks exposed missing local cache preparation — 2026-10-21
**Spec section:** Owned checks / preserve site behavior
The expanded image check failed locally at /portfolio/opengraph-image (500),
while that route returns a 108167-byte PNG (200) on the current production
version. Inspection of OpenNext's preview and upload commands shows both
populate prerendered cache assets before starting Wrangler or uploading.
The old smoke launched bare Wrangler and skipped that step, invoking the
deliberately slimmed OG runtime payload on a cache miss. Launch OpenNext's
local preview in the smoke so it uses the same asset preparation as upload;
keep every image assertion and the existing cache configuration.

### Corrected Worker harness passes all image checks — 2026-10-21
**Spec section:** Owned checks
OpenNext's local preview prepares the static cache assets and all 15
route/image checks pass, including portfolio, notes, and article OG images.
The prior RSS/sitemap cache-write logs and OG exceptions disappear. No
application/runtime configuration or asset-slimming behavior changed.

### Keep smoke cleanup direct after cache preparation — 2026-10-21
**Spec section:** Owned checks
The preview CLI wrapper logs a command error when the harness stops its
process group after successful requests. Use the installed `populateCache
local` command first, then retain direct local Wrangler startup and the
existing process-group cleanup. This preserves the successful cache
preparation without a misleading shutdown error.

### Fresh Worker build and development startup pass — 2026-10-21
**Spec section:** Owned checks
After the final harness edit, lint and the complete `pnpm test:worker`
command pass from a fresh build: all 15 route/image checks, no request errors
or cache-write logs. The development server also starts under Node 24.22.1
and returns home 200 and subscribe GET 405. All task-owned servers stop cleanly.
Remote CI, immutable preview evidence, and the exact head SHA are
recorded in the PR to avoid changing its commit merely to record its own SHA.

### Signing requires native agent approval — 2026-10-21
**Spec section:** Release and safety boundaries
The pre-commit checks pass, but the existing SSH signing agent refuses the
commit with `Couldn't sign message (signer): agent refused operation?`.
The intended signing key is listed by the 1Password agent; signing stays
enabled and no configuration or push route is changed. All ten scoped files
remain staged at base a71d2888. Native approval is required before committing,
pushing, opening the draft PR, and testing its immutable Cloudflare preview.

### Brandon authorized this commit unsigned — 2026-10-21
**Spec section:** Release and safety boundaries (current-session exception)
Brandon explicitly instructed "commit unsigned im away from that machine"
after the signing failure. Use a one-command `commit.gpgsign=false` override
for this commit, preserving the repository/global signing defaults and the
existing push route. Continue through the requested draft PR and immutable
Cloudflare preview; production merge/release remains a separate gate.

## Open questions for review

Production build settings, merge, and release remain Brandon's separate gate.

## Resumed 2026-10-21

### Test the embedded newline in Cloudflare's version input — 2026-10-21
**Spec section:** Repository-specific Node selection / preview verification
Brandon supplied the raw build log, which preserves a newline immediately
after `nodejs@24.22.1` and after the install version. The dashboard had
flattened that newline to a space. The checked-in .nvmrc ends with LF; remove
only that byte while retaining exact Node 24.22.1 and the same Actions source
of truth. A new git-connected build must establish whether this fixes the
installer before treating it as confirmed. No shared build setting changes.

### Verify the literal version file before the next build — 2026-10-21
**Spec section:** Owned checks
The official nvm parser accepts the no-LF file as 24.22.1 in an isolated
shell with auto-use disabled. The local Node 24.22.1 / pnpm 10.15.0 runner
still passes quality:gate (18 suites / 128 tests). The effective runtime and
dependency graph are unchanged; GitHub and Cloudflare will rerun their full
acceptance on the new head. Brandon's current-session unsigned-commit
authorization remains in effect; signing defaults are unchanged.
