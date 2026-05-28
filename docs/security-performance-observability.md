# Security and Performance Observability

## Alert thresholds

- `rate_limit_exceeded` spikes: alert when 429 responses exceed 50/minute for 5 minutes.
- API error rate: alert when any endpoint (`/api/invoice`, `/api/subscribe`, `/api/btcusd`, `/api/lnurlp/brandon/callback`) exceeds 5% 5xx over 10 minutes.
- Payment provider failures: alert when invoice creation or lookup errors exceed 10 in 10 minutes.
- Upstream timeout saturation: alert when 504 responses exceed 20 in 10 minutes.

## Verification checklist

- Run `pnpm lint`, `pnpm test`, and `pnpm build` before release.
- Run guardrails: `pnpm content:validate`, `pnpm content:check-links`, `pnpm content:check-images`, `pnpm security:drift`.
- Exercise all public API routes with valid and invalid payloads.
- Validate CSP is present once and includes per-request nonce in `script-src`.
- Validate proxy excludes static assets (`.*\\..*` matcher path).
- Confirm `/api/btcusd` responds with `Cache-Control` and `X-Cache-Status` headers.
- If `ENABLE_CSP_VIOLATION_REPORTS=1`, confirm `/api/csp-report` returns `204` and logs `csp_violation_report`.
- Confirm `/api/webmention` accepts only on-site `target` URLs and logs `webmention_received`.

## Security/runtime toggles

- `SITE_URL` overrides `NEXT_PUBLIC_APP_URL` for canonical metadata and absolute URLs.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable distributed rate limiting; without them the app falls back to in-memory buckets per instance.
- `ENABLE_CSP_VIOLATION_REPORTS=1` adds `report-uri` pointing at `/api/csp-report`.
- `CSP_REPORT_ONLY=1` duplicates the active CSP into `Content-Security-Policy-Report-Only`.
- `SENTRY_DSN` enables Sentry initialization in `src/instrumentation.ts`.

## Structured events

Primary API observability events:
- Subscribe: `convertkit_error_response`, `convertkit_timeout`, `convertkit_request_failed`, `subscribe_unhandled_error`
- BTC/USD: `coingecko_error_response`, `coingecko_invalid_payload`, `coingecko_timeout`, `coingecko_request_failed`, `btcusd_unhandled_error`
- Webmention/CSP: `webmention_received`, `csp_violation_report`

See `docs/runbooks/api-incident-response.md` for triage flow.
