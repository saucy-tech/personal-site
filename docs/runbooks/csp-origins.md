# CSP Origins Runbook

## Purpose
Keep the Content Security Policy in `src/utils/security.ts` no wider than what the
browser actually loads. `scripts/check-security-drift.ts` (`pnpm security:drift`) pins
the `img-src`, `font-src` and `connect-src` directives, so widening one back to a bare
scheme (`https:`, `wss:`) fails CI until this table is regenerated to justify it.

## Cross-origin requests the built site makes
Crawled 2026-09-26: every `<loc>` in `/sitemap.xml` (232 URLs) plus `/oura-health`,
`/oura-health/privacy` and `/oura-health/terms`, with the tip jar on `/support`
exercised (amount selected, "Tip me" clicked). Zero CSP violations in the console.

| Origin | Directive | Needed by |
|--------|-----------|-----------|
| `https://www.google.com` | `img-src` | `/notes` favicons (`/s2/favicons?domain=…`) |
| `https://*.gstatic.com` | `img-src` | `/notes` — Google 302s each favicon to `t0`–`t3.gstatic.com` |

That is the whole list. Everything else the browser touches is same-origin:

- Tip jar (`/support`) calls `/api/btcusd` and `/api/invoice` only. The Nostr relay
  WebSocket (`src/utils/nwc-client.ts`) and the Coinbase price lookup run inside those
  route handlers on the server, so `wss:` and `https:` were never needed in `connect-src`.
  `https://api.coingecko.com` was a leftover from before the price source moved to Coinbase.
- Fonts come from `next/font/google`, which self-hosts them under `/_next/static`, so
  `font-src` needs no CDN.
- `images.remotePatterns` in `next.config.js` is empty and no post loads a remote image.
- `next dev` HMR connects to `ws://127.0.0.1:<port>/_next/hmr`; `connect-src 'self'`
  covers it (checked, zero violations in dev).

Note: a separate PR is replacing the Google favicons on `/notes` with local icons. Until
that lands, `/notes` still needs the two Google rows above, so they stay. Once the local
icons ship, drop both origins from `img-src` and from `REQUIRED_CSP_SUBSTRINGS`, and
delete the two rows here.

## Regenerating the table
1. `pnpm build && pnpm start -p 3112`
2. Write a throwaway Playwright script (do not commit it) that fetches `/sitemap.xml`,
   visits each `<loc>` (rewritten to the local origin) plus the `/oura-health` routes,
   records every `request`/`websocket` event whose origin differs from the site, and
   collects console messages matching `Content Security Policy` (an `addInitScript`
   listener on `securitypolicyviolation` catches the ones Chromium does not log). On
   `/support`, click the "Tip me" button and wait a few seconds so the invoice fetch fires.
3. Compare the origin list to `img-src`, `font-src` and `connect-src` in
   `getSecurityHeaders()`. Remove origins no page uses; add one only if a page reports a
   violation without it.
4. Update `REQUIRED_CSP_SUBSTRINGS` in `src/utils/security.ts` to match, run
   `pnpm security:drift` and `pnpm check`, and rewrite the table above with the new date.
