/**
 * @jest-environment node
 *
 * The rate limiter's failure modes, which are the part that matters.
 *
 * Original defect: the limiter counted into a module-global Map. On Workers
 * every colo runs its own isolates, each with its own empty Map, so the
 * documented limits (5/min subscribe, 10/min invoice) bounded nothing, and what
 * sat behind them was Brandon's Kit API key and his Alby wallet.
 *
 * The first replacement counted in KV, which cannot do this job: no atomic
 * increment, and one write per second per key. Treating a throttled write as
 * failure denied legitimate callers; not treating it as failure let roughly 400
 * requests through a 5/min limit at 100 req/s. These tests exist partly to stop
 * anyone reaching for a read-modify-write counter again.
 */

const mockGetCloudflareContext = jest.fn();
jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: (...args: unknown[]) => mockGetCloudflareContext(...args),
}));

import { rateLimit, SECURITY_CONSTANTS } from '@/utils/security';

const WINDOW = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS;
const SUBSCRIBE = SECURITY_CONSTANTS.RATE_LIMIT_SUBSCRIBE;
const INVOICE = SECURITY_CONSTANTS.RATE_LIMIT_INVOICE;

let ipCounter = 0;
const uniqueIP = () => `10.9.${Math.floor(ipCounter / 250)}.${ipCounter++ % 250}`;

const makeRequest = (ip: string) =>
  new Request('https://saucy.tech/api/subscribe', { headers: { 'cf-connecting-ip': ip } });

/** Stands in for the runtime binding: one atomic counter per key. */
function fakeLimiter(limit: number) {
  const counts = new Map<string, number>();
  return {
    calls: 0,
    async limit(this: { calls: number }, { key }: { key: string }) {
      this.calls += 1;
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      return { success: next <= limit };
    },
  };
}

describe('rateLimit with the runtime rate-limiting binding', () => {
  beforeEach(() => mockGetCloudflareContext.mockReset());

  it('allows up to the limit and refuses the request past it', async () => {
    mockGetCloudflareContext.mockResolvedValue({
      env: { RATE_LIMITER_SUBSCRIBE: fakeLimiter(SUBSCRIBE) },
    });

    const ip = uniqueIP();
    for (let i = 0; i < SUBSCRIBE; i++) {
      expect((await rateLimit(makeRequest(ip), SUBSCRIBE, WINDOW, 'subscribe')).allowed).toBe(true);
    }
    const blocked = await rateLimit(makeRequest(ip), SUBSCRIBE, WINDOW, 'subscribe');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  // The bug the KV version had: a fast caller must not outrun the counter.
  it('binds under a burst rather than letting it outrun the count', async () => {
    mockGetCloudflareContext.mockResolvedValue({
      env: { RATE_LIMITER_SUBSCRIBE: fakeLimiter(SUBSCRIBE) },
    });

    const ip = uniqueIP();
    const results = await Promise.all(
      Array.from({ length: 200 }, () => rateLimit(makeRequest(ip), SUBSCRIBE, WINDOW, 'subscribe'))
    );

    expect(results.filter((r) => r.allowed)).toHaveLength(SUBSCRIBE);
  });

  it('scopes the count per caller and per endpoint', async () => {
    mockGetCloudflareContext.mockResolvedValue({
      env: { RATE_LIMITER_SUBSCRIBE: fakeLimiter(SUBSCRIBE) },
    });

    const noisy = uniqueIP();
    const quiet = uniqueIP();
    for (let i = 0; i <= SUBSCRIBE; i++)
      await rateLimit(makeRequest(noisy), SUBSCRIBE, WINDOW, 'subscribe');

    expect((await rateLimit(makeRequest(noisy), SUBSCRIBE, WINDOW, 'subscribe')).allowed).toBe(
      false
    );
    expect((await rateLimit(makeRequest(quiet), SUBSCRIBE, WINDOW, 'subscribe')).allowed).toBe(
      true
    );
  });

  it('sends each tier to its own binding', async () => {
    const subscribe = fakeLimiter(SUBSCRIBE);
    const invoice = fakeLimiter(INVOICE);
    mockGetCloudflareContext.mockResolvedValue({
      env: { RATE_LIMITER_SUBSCRIBE: subscribe, RATE_LIMITER_INVOICE: invoice },
    });

    const ip = uniqueIP();
    await rateLimit(makeRequest(ip), SUBSCRIBE, WINDOW, 'subscribe');
    await rateLimit(makeRequest(ip), INVOICE, WINDOW, 'invoice');

    expect(subscribe.calls).toBe(1);
    expect(invoice.calls).toBe(1);
  });

  // A limiter that cannot count must not wave traffic through.
  it('denies when the binding throws', async () => {
    mockGetCloudflareContext.mockResolvedValue({
      env: {
        RATE_LIMITER_SUBSCRIBE: {
          limit: async () => {
            throw new Error('binding unavailable');
          },
        },
      },
    });

    const result = await rateLimit(makeRequest(uniqueIP()), SUBSCRIBE, WINDOW, 'subscribe');
    expect(result.allowed).toBe(false);
  });

  it('falls back to the per-isolate bucket only when the binding is absent', async () => {
    mockGetCloudflareContext.mockResolvedValue({ env: {} });

    // Still answers, so a missing binding degrades rather than breaking the
    // site — but security.ts logs rate_limit_per_isolate_fallback when it does.
    expect((await rateLimit(makeRequest(uniqueIP()), SUBSCRIBE, WINDOW, 'subscribe')).allowed).toBe(
      true
    );
  });
});
