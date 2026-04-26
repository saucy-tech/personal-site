# Security and Performance Observability

## Alert thresholds

- `rate_limit_exceeded` spikes: alert when 429 responses exceed 50/minute for 5 minutes.
- API error rate: alert when any endpoint (`/api/invoice`, `/api/subscribe`, `/api/btcusd`, `/api/lnurlp/brandon/callback`) exceeds 5% 5xx over 10 minutes.
- Payment provider failures: alert when invoice creation or lookup errors exceed 10 in 10 minutes.
- Upstream timeout saturation: alert when 504 responses exceed 20 in 10 minutes.

## Verification checklist

- Run `pnpm lint`, `pnpm test`, and `pnpm build` before release.
- Run guardrails: `pnpm content:validate`, `pnpm content:check-links`, `pnpm content:check-images`.
- Exercise all public API routes with valid and invalid payloads.
- Validate CSP is present once and includes per-request nonce in `script-src`.
- Validate proxy excludes static assets (`.*\\..*` matcher path).
- Confirm `/api/btcusd` responds with `Cache-Control` and `X-Cache-Status` headers.

## Structured events

Primary API observability events:
- Subscribe: `convertkit_error_response`, `convertkit_timeout`, `convertkit_request_failed`, `subscribe_unhandled_error`
- BTC/USD: `coingecko_error_response`, `coingecko_invalid_payload`, `coingecko_timeout`, `coingecko_request_failed`, `btcusd_unhandled_error`

See `docs/runbooks/api-incident-response.md` for triage flow.
