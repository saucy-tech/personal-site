/**
 * @jest-environment node
 *
 * The rate limiter's failure modes, which are the part that matters.
 *
 * The defect these cover: the limiter counted into a module-global Map. On
 * Workers every colo runs its own isolates, each with its own empty Map, so the
 * documented limits (5/min subscribe, 10/min invoice) bounded nothing — a
 * caller exceeded them by however many isolates it reached, and what sat behind
 * them was Brandon's Kit API key and his Alby wallet. The distributed path also
 * returned null on any backend error, which silently dropped back to that same
 * Map rather than denying.
 */

const mockGetCloudflareContext = jest.fn();
jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: (...args: unknown[]) => mockGetCloudflareContext(...args),
}));

import { rateLimit, SECURITY_CONSTANTS } from '@/utils/security';

const WINDOW = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS;

let ipCounter = 0;
const uniqueIP = () => `10.9.${Math.floor(ipCounter / 250)}.${ipCounter++ % 250}`;

const makeRequest = (ip: string) =>
  new Request('https://saucy.tech/api/subscribe', { headers: { 'cf-connecting-ip': ip } });

/** A KV namespace shared by every caller, which is the whole point. */
function fakeKV() {
  const store = new Map<string, string>();
  return {
    puts: 0,
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(this: { puts: number }, key: string, value: string) {
      this.puts += 1;
      store.set(key, value);
    },
  };
}

describe('rateLimit with a KV binding', () => {
  beforeEach(() => {
    mockGetCloudflareContext.mockReset();
  });

  it('counts across calls that share no in-process state', async () => {
    const kv = fakeKV();
    mockGetCloudflareContext.mockResolvedValue({ env: { RATE_LIMIT: kv } });

    const ip = uniqueIP();
    const prefix = `kv-${ip}`;
    const max = 3;

    for (let i = 0; i < max; i++) {
      const result = await rateLimit(makeRequest(ip), max, WINDOW, prefix);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(max - (i + 1));
    }

    const blocked = await rateLimit(makeRequest(ip), max, WINDOW, prefix);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('scopes the count per caller, not globally', async () => {
    const kv = fakeKV();
    mockGetCloudflareContext.mockResolvedValue({ env: { RATE_LIMIT: kv } });

    const prefix = `kv-scope-${uniqueIP()}`;
    const noisy = uniqueIP();
    const quiet = uniqueIP();

    await rateLimit(makeRequest(noisy), 1, WINDOW, prefix);
    const noisyBlocked = await rateLimit(makeRequest(noisy), 1, WINDOW, prefix);
    const quietAllowed = await rateLimit(makeRequest(quiet), 1, WINDOW, prefix);

    expect(noisyBlocked.allowed).toBe(false);
    expect(quietAllowed.allowed).toBe(true);
  });

  it('does not write once the caller is already over the limit', async () => {
    const kv = fakeKV();
    mockGetCloudflareContext.mockResolvedValue({ env: { RATE_LIMIT: kv } });

    const ip = uniqueIP();
    const prefix = `kv-writes-${ip}`;
    await rateLimit(makeRequest(ip), 1, WINDOW, prefix);
    const before = kv.puts;
    await rateLimit(makeRequest(ip), 1, WINDOW, prefix);

    expect(kv.puts).toBe(before);
  });

  // The regression that matters: a limiter that cannot count must deny.
  it('denies when the KV read throws instead of falling through', async () => {
    mockGetCloudflareContext.mockResolvedValue({
      env: {
        RATE_LIMIT: {
          get: async () => {
            throw new Error('KV unavailable');
          },
          put: async () => undefined,
        },
      },
    });

    const ip = uniqueIP();
    const result = await rateLimit(makeRequest(ip), 5, WINDOW, `kv-error-${ip}`);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  // KV accepts one write per second to a key, so a caller making two requests
  // inside the same second reliably fails the second put. Denying on that would
  // refuse legitimate traffic far below the configured allowance.
  it('allows the request when only the KV write fails', async () => {
    const store = new Map<string, string>();
    mockGetCloudflareContext.mockResolvedValue({
      env: {
        RATE_LIMIT: {
          get: async (k: string) => store.get(k) ?? null,
          put: async () => {
            throw new Error('KV PUT failed: 429 Too Many Requests');
          },
        },
      },
    });

    const ip = uniqueIP();
    const prefix = `kv-write-fail-${ip}`;
    for (let i = 0; i < 3; i++) {
      const result = await rateLimit(makeRequest(ip), 5, WINDOW, prefix);
      expect(result.allowed).toBe(true);
    }
  });

  // A dropped write undercounts rather than un-limits: the count still climbs
  // on every write that lands, so the limit continues to bind.
  it('still enforces the limit when some writes land and some do not', async () => {
    const store = new Map<string, string>();
    let attempt = 0;
    mockGetCloudflareContext.mockResolvedValue({
      env: {
        RATE_LIMIT: {
          get: async (k: string) => store.get(k) ?? null,
          put: async (k: string, v: string) => {
            // Every other write is throttled, as a burst against KV would be.
            if (attempt++ % 2 === 1) throw new Error('429');
            store.set(k, v);
          },
        },
      },
    });

    const ip = uniqueIP();
    const prefix = `kv-partial-${ip}`;
    let denied = false;
    for (let i = 0; i < 12; i++) {
      const result = await rateLimit(makeRequest(ip), 3, WINDOW, prefix);
      if (!result.allowed) denied = true;
    }

    expect(denied).toBe(true);
  });

  it('falls back to the per-isolate bucket only when there is no binding at all', async () => {
    mockGetCloudflareContext.mockResolvedValue({ env: {} });

    const ip = uniqueIP();
    const result = await rateLimit(makeRequest(ip), 5, WINDOW, `kv-absent-${ip}`);

    // Still answers, so a missing binding degrades rather than breaking the
    // site — but security.ts logs rate_limit_per_isolate_fallback when it does.
    expect(result.allowed).toBe(true);
  });
});
