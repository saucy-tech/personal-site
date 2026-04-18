/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

const mockRateLimit = jest.fn().mockResolvedValue({
  allowed: true,
  resetTime: Date.now() + 60_000,
  remaining: 59,
});
const mockCreateRateLimitResponse = jest.fn();
const mockCreateSecureErrorResponse = jest.fn((message: string, status: number) =>
  Response.json({ error: message }, { status })
);
const mockLogSecurityEvent = jest.fn();

jest.mock('@/utils/security', () => ({
  rateLimit: (...args: unknown[]) => mockRateLimit(...args),
  createRateLimitResponse: (...args: unknown[]) => mockCreateRateLimitResponse(...args),
  createSecureErrorResponse: (...args: unknown[]) => mockCreateSecureErrorResponse(...args),
  logSecurityEvent: (...args: unknown[]) => mockLogSecurityEvent(...args),
  SECURITY_CONSTANTS: {
    RATE_LIMIT_API: 60,
    RATE_LIMIT_WINDOW_MS: 60_000,
    REQUEST_TIMEOUT: 30_000,
  },
}));

function makeRequest() {
  return new NextRequest('http://localhost/api/btcusd', {
    headers: { 'x-forwarded-for': '127.0.0.1' },
  });
}

describe('GET /api/btcusd', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('returns MISS with cache-control header on first fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ bitcoin: { usd: 65000 } }), { status: 200 })
    );
    const { GET } = await import('@/app/api/btcusd/route');
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Cache-Status')).toBe('MISS');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('returns HIT when cached value exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ bitcoin: { usd: 65000 } }), { status: 200 })
    );
    const { GET } = await import('@/app/api/btcusd/route');
    await GET(makeRequest());
    const second = await GET(makeRequest());

    expect(second.status).toBe(200);
    expect(second.headers.get('X-Cache-Status')).toBe('HIT');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('returns 429 response when rate limit rejects request', async () => {
    mockRateLimit.mockResolvedValueOnce({
      allowed: false,
      resetTime: Date.now() + 10_000,
      remaining: 0,
    });
    mockCreateRateLimitResponse.mockReturnValueOnce(
      Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
    );
    const { GET } = await import('@/app/api/btcusd/route');
    const response = await GET(makeRequest());

    expect(response.status).toBe(429);
  });
});
