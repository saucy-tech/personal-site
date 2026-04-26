/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

jest.mock('ws', () => class MockWebSocket {});

const mockMakeInvoice = jest.fn();
const mockLookupInvoice = jest.fn();
const mockNWCClient = jest.fn().mockImplementation(() => ({
  makeInvoice: mockMakeInvoice,
  lookupInvoice: mockLookupInvoice,
}));
const mockTrackPaymentAttempt = jest.fn().mockReturnValue(true);

jest.mock('@getalby/sdk', () => ({
  NWCClient: mockNWCClient,
}));

jest.mock('@/utils/lnurl-config', () => ({
  trackPaymentAttempt: mockTrackPaymentAttempt,
}));

const originalNwcUrl = process.env.NOSTR_WALLET_CONNECT_URL;
const validHash = 'a'.repeat(64);

let ipSeed = 100;

function uniqueIP(): string {
  return `172.16.${Math.floor(ipSeed / 255)}.${ipSeed++ % 255}`;
}

function makePostRequest(body: string | object, ip = uniqueIP()) {
  return new NextRequest('http://localhost/api/invoice', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function makeGetRequest(paymentHash: string | null, ip = uniqueIP()) {
  const url = paymentHash
    ? `http://localhost/api/invoice?paymentHash=${paymentHash}`
    : 'http://localhost/api/invoice';

  return new NextRequest(url, {
    method: 'GET',
    headers: { 'x-forwarded-for': ip },
  });
}

async function loadRoute(nwcUrl: string | undefined = 'nwc://test-url') {
  if (nwcUrl === undefined) {
    delete process.env.NOSTR_WALLET_CONNECT_URL;
  } else {
    process.env.NOSTR_WALLET_CONNECT_URL = nwcUrl;
  }

  jest.resetModules();
  // Use Jest's module loader so the route re-evaluates its module-level env capture.
  return require('@/app/api/invoice/route') as typeof import('@/app/api/invoice/route');
}

beforeEach(() => {
  mockMakeInvoice.mockReset();
  mockLookupInvoice.mockReset();
  mockNWCClient.mockClear();
  mockTrackPaymentAttempt.mockReset();
  mockTrackPaymentAttempt.mockReturnValue(true);
  process.env.NOSTR_WALLET_CONNECT_URL = 'nwc://test-url';
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  if (originalNwcUrl === undefined) {
    delete process.env.NOSTR_WALLET_CONNECT_URL;
  } else {
    process.env.NOSTR_WALLET_CONNECT_URL = originalNwcUrl;
  }

  jest.resetModules();
});

describe('POST /api/invoice', () => {
  it('returns 400 for malformed JSON bodies', async () => {
    const { POST } = await loadRoute();
    const response = await POST(makePostRequest('{'));

    await expect(response.json()).resolves.toEqual({ error: 'Invalid request body' });
    expect(response.status).toBe(400);
    expect(mockNWCClient).not.toHaveBeenCalled();
  });

  it('returns 400 for a negative amount', async () => {
    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: -5 }));

    expect(response.status).toBe(400);
  });

  it('returns 400 for zero amount', async () => {
    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: 0 }));

    expect(response.status).toBe(400);
  });

  it('returns 400 for an amount exceeding the maximum', async () => {
    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: 2_000_000 }));

    expect(response.status).toBe(400);
  });

  it('returns 200 with invoice data on a valid request', async () => {
    mockMakeInvoice.mockResolvedValueOnce({
      invoice: 'lnbc1000n1...',
      payment_hash: validHash,
    });

    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: 1000, memo: 'test tip' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      paymentRequest: 'lnbc1000n1...',
      paymentHash: validHash,
    });
    expect(mockNWCClient).toHaveBeenCalledWith({ nostrWalletConnectUrl: 'nwc://test-url' });
    expect(mockTrackPaymentAttempt).toHaveBeenCalledWith(validHash, 1000, expect.any(String));
  });

  it('returns 503 when the NWC SDK throws', async () => {
    mockMakeInvoice.mockRejectedValueOnce(new Error('connection failed'));

    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: 1000 }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'Unable to process payment request' });
  });

  it('returns 429 when rapid payment-attempt tracking rejects the hash', async () => {
    mockMakeInvoice.mockResolvedValueOnce({
      invoice: 'lnbc1000n1...',
      payment_hash: validHash,
    });
    mockTrackPaymentAttempt.mockReturnValueOnce(false);

    const { POST } = await loadRoute();
    const response = await POST(makePostRequest({ amount: 1000, memo: 'burst test' }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ error: 'Too many rapid attempts' });
  });
});

describe('GET /api/invoice', () => {
  it('returns 400 when paymentHash is missing', async () => {
    const { GET } = await loadRoute();
    const response = await GET(makeGetRequest(null));

    expect(response.status).toBe(400);
  });

  it('returns 400 for an invalid payment hash format', async () => {
    const { GET } = await loadRoute();
    const response = await GET(makeGetRequest('tooshort'));

    expect(response.status).toBe(400);
  });

  it('returns paid=true when the invoice is settled', async () => {
    mockLookupInvoice.mockResolvedValueOnce({
      settled_at: 1700000000,
      preimage: 'deadbeef',
    });

    const { GET } = await loadRoute();
    const response = await GET(makeGetRequest(validHash));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ paid: true, preimage: 'deadbeef' });
  });

  it('returns paid=false when the invoice is not yet settled', async () => {
    mockLookupInvoice.mockResolvedValueOnce({ settled_at: null });

    const { GET } = await loadRoute();
    const response = await GET(makeGetRequest(validHash));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ paid: false, preimage: null });
  });

  it('returns paid=false when lookupInvoice throws so the client can keep polling', async () => {
    mockLookupInvoice.mockRejectedValueOnce(new Error('lookup failed'));

    const { GET } = await loadRoute();
    const response = await GET(makeGetRequest(validHash));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      paid: false,
      error: 'Unable to verify payment status. Will try again.',
    });
  });
});
