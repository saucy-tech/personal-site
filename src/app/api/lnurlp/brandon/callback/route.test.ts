/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

const mockMakeInvoice = jest.fn();
const mockNWCClient = jest.fn().mockImplementation(() => ({
  makeInvoice: mockMakeInvoice,
}));
const mockValidateLnurlAmount = jest.fn().mockReturnValue({ valid: true });

jest.mock('@getalby/sdk', () => ({
  NWCClient: mockNWCClient,
}));

jest.mock('@/utils/lnurl-config', () => ({
  validateLnurlAmount: (...args: unknown[]) => mockValidateLnurlAmount(...args),
}));

const originalNwcUrl = process.env.NOSTR_WALLET_CONNECT_URL;

function makeRequest(query = '') {
  return new NextRequest(`http://localhost/api/lnurlp/brandon/callback${query}`);
}

async function loadRoute() {
  jest.resetModules();
  return require('@/app/api/lnurlp/brandon/callback/route') as typeof import('@/app/api/lnurlp/brandon/callback/route');
}

beforeEach(() => {
  process.env.NOSTR_WALLET_CONNECT_URL = 'nwc://test-url';
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockMakeInvoice.mockReset();
  mockValidateLnurlAmount.mockReset();
  mockValidateLnurlAmount.mockReturnValue({ valid: true });
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
});

describe('GET /api/lnurlp/brandon/callback', () => {
  it('returns 400 when amount is missing', async () => {
    const { GET } = await loadRoute();
    const response = await GET(makeRequest());
    expect(response.status).toBe(400);
  });

  it('returns 400 when amount validation fails', async () => {
    mockValidateLnurlAmount.mockReturnValueOnce({ valid: false, error: 'invalid amount' });
    const { GET } = await loadRoute();
    const response = await GET(makeRequest('?amount=1000'));
    expect(response.status).toBe(400);
  });

  it('returns invoice payload on success', async () => {
    mockMakeInvoice.mockResolvedValueOnce({ invoice: 'lnbc1test' });
    const { GET } = await loadRoute();
    const response = await GET(makeRequest('?amount=1000'));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ pr: 'lnbc1test', routes: [] });
  });
});
