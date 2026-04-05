/** @jest-environment node */

import { NextRequest } from 'next/server';

const mockMakeInvoice = jest.fn();
const mockLookupInvoice = jest.fn();
const mockNWCClient = jest.fn().mockImplementation(() => ({
  makeInvoice: mockMakeInvoice,
  lookupInvoice: mockLookupInvoice,
}));

jest.mock('@getalby/sdk', () => ({
  NWCClient: mockNWCClient,
}));

describe('POST /api/invoice', () => {
  const originalNwcUrl = process.env.NOSTR_WALLET_CONNECT_URL;
  let postHandler: (request: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    delete process.env.NOSTR_WALLET_CONNECT_URL;
    ({ POST: postHandler } = await import('./route'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (originalNwcUrl === undefined) {
      delete process.env.NOSTR_WALLET_CONNECT_URL;
    } else {
      process.env.NOSTR_WALLET_CONNECT_URL = originalNwcUrl;
    }
  });

  it('returns 400 for malformed JSON bodies', async () => {
    const request = new NextRequest('http://localhost:3000/api/invoice', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.20',
      },
      body: '{',
    });

    const response = await postHandler(request);

    await expect(response.json()).resolves.toEqual({ error: 'Invalid request body' });
    expect(response.status).toBe(400);
    expect(mockNWCClient).not.toHaveBeenCalled();
  });

  it('preserves the existing valid JSON service path', async () => {
    const request = new NextRequest('http://localhost:3000/api/invoice', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.21',
      },
      body: JSON.stringify({ amount: 1000, memo: 'tip' }),
    });

    const response = await postHandler(request);

    await expect(response.json()).resolves.toEqual({ error: 'Service temporarily unavailable' });
    expect(response.status).toBe(503);
    expect(mockNWCClient).not.toHaveBeenCalled();
  });
});
