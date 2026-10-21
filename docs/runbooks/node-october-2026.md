# October 2026 Node security remediation

## Scope and resolved graph

The [Node October advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
fixes Node core and bundled dependencies in 22.23.4, 24.22.1, and 26.12.1.
This repository selects **24.22.1 LTS** in `.nvmrc`; both Node-using Actions
read that file. `engines.node` requires the patched 24.x line. pnpm remains
**10.15.0**. Use a per-shell runner or `nvm use`; do not change a shared host's
default runtime to validate this repository.

Separately, [GHSA-xjj6-f33q-929c / CVE-2026-109869](https://github.com/nodejs/undici/security/advisories/GHSA-xjj6-f33q-929c)
requires npm Undici 6.29.1 or 7.30.1 on the installed major lines:

- Node 24.22.1 reports bundled Undici **7.30.1**.
- OpenNext 1.20.12 → dotenvx 2.38.2 → npm Undici **6.29.1** (unchanged).
- Wrangler 4.151.1 → Miniflare 5.20261012.1-beta → npm Undici **7.30.1**
  (updated from 7.29.1). Wrangler is also a peer of OpenNext and Sentry's
  Cloudflare integration, so those paths resolve the same patched instance.

Same-major overrides enforce both floors without introducing Undici 8.
Wrangler 4.151.2 and 4.151.3 still pin vulnerable Undici 7.29.1 through their
Miniflare versions, so upgrading the parent would not remove the override.
Next 16.4.2, React/React DOM 19.3.1, OpenNext 1.20.12, Wrangler 4.151.1,
compatibility date `2026-10-13`, flags, routes, and bindings are retained.

## Reproduce local acceptance

With `node --version` reporting `v24.22.1` and `pnpm --version` reporting
`10.15.0`, run:

```sh
pnpm install --frozen-lockfile
pnpm quality:gate
NEXT_PUBLIC_APP_URL=https://example.com pnpm build
pnpm exec tsc --noEmit
```

Start `pnpm start` in another terminal, then match CI's production-server E2E
flow with `CI=true pnpm exec playwright test`. Install the matching Chromium
first with `pnpm exec playwright install chromium` if needed. Local secrets
must be absent: the Lightning test expects an unconfigured service (503),
uses a mocked BTC quote, and successful Kit requests are mocked in unit tests.
Do not run that full suite against a deployed preview with real bindings.

Stop the Next server before the Worker build, then run:

```sh
NEXT_PUBLIC_APP_URL=https://example.com WRANGLER_SEND_METRICS=false pnpm test:worker
pnpm why undici
pnpm audit --json
pnpm audit --prod --json
```

The expanded Worker smoke checks home, portfolio, about, notes, blog/article,
RSS and sitemap (200 plus body markers), subscribe GET (405), missing page
(404), and OG/static images (200, image content type, nontrivial body).
Requests use `redirect: 'manual'` so a redirect cannot hide a failed route.

Record results for the exact PR head in its description. Before dependency
edits, the original graph passed quality:gate (18 suites / 128 tests), Next
build, explicit TypeScript, and Worker smoke on Node 24.22.1. A local malformed
HTTP-response check also confirms that bundled Undici 7.30.1 and npm Undici
6.29.1 / 7.30.1 reject excessive encodings and survive premature close.

## Audit and runtime limits

The completed full audit reports one existing high finding:
**braces 3.0.3, CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm**, through
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch.
The registry reports no patched release. Production audit reports zero.
Neither baseline audit detected vulnerable Undici 7.29.1; audit output alone
does not establish remediation. Check the official advisory and resolved graph.

Lockfile regeneration reports an existing optional peer mismatch:
schema-utils 4.8.1 requests webpack ^5.112.0, while Sentry's graph resolves
5.106.2. Both are unchanged. The original bare-Wrangler smoke skipped
OpenNext's cache preparation, producing read-only-cache errors and a 500 on
OG images after build-time slimming. Current production serves that OG image
successfully. The smoke now runs OpenNext's `populateCache local`, preparing
the same prerendered cache assets as preview/upload before starting local Wrangler.
Keep image assertions enabled; do not replace them with a build-only check.

Cloudflare's deployed Worker uses its provider-managed runtime and Node
compatibility APIs, rather than this build-time Node executable. These checks
do not establish Cloudflare's internal patch rollout. The local workerd
version remains 1.20261012.1; changing npm Undici does not certify workerd's
bundled native libraries. Compatibility settings remain unchanged.

## Production snapshot and build settings (2026-10-21, read only)

Cloudflare's active deployment is `2d835b6c-5dca-4259-b7ae-e5e993faf3aa`,
serving version **0453fe5e-8dd9-47df-bb9e-22ea7fb51bb5** (version 276) at
100%, created `2026-10-21T17:56:02.727021Z`. Its source commit is
**a71d2888dc51fc574f773ea4af65649ef74335c7**. The successful
[production build](https://dash.cloudflare.com/f5c6b97a3e206c517a9d01df0818bf03/workers/services/view/personal-site/production/builds/10eeb921-7f18-4c2c-9b6e-f18eff83f0ae)
reports Node **25.9.0** and pnpm **10.15.0**.

Dashboard Builds settings are shared for this legacy Git integration:
production branch `main`, non-production builds enabled, root `/`, build
`pnpm run build:worker`, deploy `npx opennextjs-cloudflare deploy`, version
upload `npx opennextjs-cloudflare upload`, and no build variables or secrets.
`NODE_VERSION` is **unset for both production and non-production builds**.
No dashboard settings were changed; there is no preview-only override to
reconcile. The release-setting diff is the repository's `.nvmrc` value
`25` → `24.22.1`; merging applies it to the next production build.

The current version is retained in the recent-version list, within
Cloudflare's latest-100 rollback limit. This PR changes no bindings or
migrations. That supplies a rollback candidate, not proof of a future
rollback's success; recheck availability and binding compatibility at release.

## Commit-specific preview verification

Require both GitHub Actions checks and **Workers Builds: personal-site** to
succeed. Open the successful build and match its full source SHA to the PR
head. Confirm its detected Node 24.22.1 / pnpm 10.15.0 and capture the full
version UUID and immutable version preview URL. Branch aliases can move.

Repeat the Worker route checks on that version URL, inspecting status, body,
content type, and redirect destinations. Keep requests on that origin;
`/field-notes` should redirect to `/notes` on the same preview. Verify dynamic
startup with `/api/subscribe` GET (405, empty body). Compare actual desktop and
mobile rendering, navigation, and newsletter dialog open/close/focus with the
baseline. Inspect version-filtered Worker logs. Never submit signup, tip,
payment, webmention, or CSP-report requests: previews share live bindings.

## Release and rollback (pending Brandon's approval)

1. Re-read the PR's exact head, passing checks, immutable preview evidence,
   production version, and settings before approval. If `NODE_VERSION` has
   appeared since this snapshot, stop and prepare its exact old/new diff;
   remove it or set 24.22.1 only with release approval.
2. After approval, merge **personal-site first**. Git integration auto-deploys
   `main`. Confirm the production build uses Node 24.22.1 / pnpm 10.15.0 and
   matches the merged commit. Repeat read-only route and visual checks on
   `saucy.tech`, then observe Worker errors before proceeding.
3. Release **Morning Portion second**, through its separate approval and
   validation gates. Neither release is executed by preparing this PR.
4. If production regresses, obtain approval to restore the retained version
   using the deployment UI or
   `pnpm exec wrangler rollback 0453fe5e-8dd9-47df-bb9e-22ea7fb51bb5`.
   Verify 100% traffic, routes and errors after rollback. Rollback does not
   restore external data or build settings; see
   [Cloudflare's rollback limits](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
   This candidate was built with EOL Node 25.9.0; use it only as an emergency
   behavior rollback and follow with a corrected patched build. For source
   rollback, revert the remediation merge on a reviewed branch and revalidate;
   do not reset or force-push main.
