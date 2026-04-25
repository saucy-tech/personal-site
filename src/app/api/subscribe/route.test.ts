/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/subscribe/route';

const originalFormId = process.env.CONVERTKIT_FORM_ID;
const originalApiKey = process.env.CONVERTKIT_API_KEY;

let ipSeed = 200;

function uniqueIP(): string {
  return `192.168.${Math.floor(ipSeed / 255)}.${ipSeed++ % 255}`;
}

function makeRequest(body: string | object, ip = uniqueIP()) {
  return new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
  process.env.CONVERTKIT_FORM_ID = 'test-form-id';
  process.env.CONVERTKIT_API_KEY = 'test-api-key';
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  if (originalFormId === undefined) {
    delete process.env.CONVERTKIT_FORM_ID;
  } else {
    process.env.CONVERTKIT_FORM_ID = originalFormId;
  }

  if (originalApiKey === undefined) {
    delete process.env.CONVERTKIT_API_KEY;
  } else {
    process.env.CONVERTKIT_API_KEY = originalApiKey;
  }
});

describe('POST /api/subscribe', () => {
  it('returns 400 for malformed JSON bodies', async () => {
    const response = await POST(makeRequest('{'));

    await expect(response.json()).resolves.toEqual({ error: 'Invalid request body' });
    expect(response.status).toBe(400);
  });

  it('returns 200 with success=true on the happy path', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ subscriber: {} }), { status: 200 })
    );

    const response = await POST(makeRequest({ email: 'user@example.com' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it('returns 200 when honeypot company field is filled (silent drop)', async () => {
    const response = await POST(makeRequest({ email: 'user@example.com', company: 'Evil Corp' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 when ConvertKit reports already subscribed', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Subscriber already subscribed' }), { status: 400 })
    );

    const response = await POST(makeRequest({ email: 'user@example.com' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, alreadySubscribed: true });
  });

  it('returns 400 for an invalid email', async () => {
    const response = await POST(makeRequest({ email: 'not-an-email' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/invalid email/i);
  });

  it('returns 400 for an empty email', async () => {
    const response = await POST(makeRequest({ email: '' }));

    expect(response.status).toBe(400);
  });

  it('returns 502 when ConvertKit returns a non-2xx status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'server error' }), { status: 500 })
    );

    const response = await POST(makeRequest({ email: 'user@example.com' }));

    expect(response.status).toBe(502);
  });

  it('returns 503 when ConvertKit credentials are missing', async () => {
    delete process.env.CONVERTKIT_FORM_ID;
    delete process.env.CONVERTKIT_API_KEY;

    const response = await POST(makeRequest({ email: 'user@example.com' }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toMatch(/temporarily unavailable/i);
  });

  it('returns 429 after exceeding the rate limit for one IP', async () => {
    const ip = uniqueIP();

    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ subscriber: {} }), { status: 200 })
    );

    for (let i = 0; i < 5; i += 1) {
      await POST(makeRequest({ email: `user${i}@example.com` }, ip));
    }

    const response = await POST(makeRequest({ email: 'overflow@example.com' }, ip));

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).not.toBeNull();
  });
});
