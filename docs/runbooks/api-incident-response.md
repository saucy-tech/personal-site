# API Incident Response Runbook

## Scope
- `/api/subscribe`
- `/api/invoice`
- `/api/btcusd`
- `/api/lnurlp/brandon/callback`

## Fast Triage (first 10 minutes)
- Confirm deploy status and recent changes in Vercel.
- Check request failure rate and status-code breakdown by endpoint.
- Inspect structured logs for `event` values ending in `_error`, `_timeout`, `_failed`, or `unhandled_error`.
- Determine if issue is internal (app logic) or upstream dependency (ConvertKit, CoinGecko, NWC wallet).

## Structured Log Queries
- Subscribe failures: filter `event` in:
  - `convertkit_error_response`
  - `convertkit_timeout`
  - `convertkit_request_failed`
  - `subscribe_unhandled_error`
- BTC/USD failures: filter `event` in:
  - `coingecko_error_response`
  - `coingecko_invalid_payload`
  - `coingecko_timeout`
  - `coingecko_request_failed`
  - `btcusd_unhandled_error`

## Endpoint-Specific Playbooks

### `/api/subscribe`
- `503 Service temporarily unavailable`: verify `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID`.
- Elevated `502`: inspect `convertkit_error_response` payload fields for upstream status changes.
- Elevated `504`: treat as upstream timeout; monitor recovery and keep endpoint in degraded mode.

### `/api/btcusd`
- Frequent cache misses + errors: verify CoinGecko availability and headers.
- `coingecko_invalid_payload`: likely upstream response shape drift; patch parser quickly.
- `504` spikes: watch for upstream saturation and temporarily increase cache reliance.

### `/api/invoice` and `/api/lnurlp/*`
- Validate `NOSTR_WALLET_CONNECT_URL` presence and freshness.
- Confirm payment hash lookups still return parseable responses.
- Watch for suspicious-request and invalid-input spikes (abuse vs. product issue).

## Mitigation Checklist
- Reduce blast radius: feature-flag or temporary fallback response if needed.
- Preserve security controls (rate limiting, request size checks) during mitigation.
- Add or update tests before final fix deploy.
- Capture incident notes and root-cause summary in `docs/security-performance-observability.md`.

## Exit Criteria
- Error rate back within baseline for 30+ minutes.
- No active timeout spikes.
- Structured logs show normal success/error ratio.
- Follow-up issue created for permanent prevention work.
