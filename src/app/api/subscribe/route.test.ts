/** @jest-environment node */

import { NextRequest } from 'next/server';
import { POST } from './route';

describe('POST /api/subscribe', () => {
  const originalFormId = process.env.CONVERTKIT_FORM_ID;
  const originalApiKey = process.env.CONVERTKIT_API_KEY;

  beforeEach(() => {
    delete process.env.CONVERTKIT_FORM_ID;
    delete process.env.CONVERTKIT_API_KEY;
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

  it('returns 400 for malformed JSON bodies', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.10',
      },
      body: '{',
    });

    const response = await POST(request);

    await expect(response.json()).resolves.toEqual({ error: 'Invalid request body' });
    expect(response.status).toBe(400);
  });

  it('preserves the existing valid JSON service path', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.11',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);

    await expect(response.json()).resolves.toEqual({ error: 'Service temporarily unavailable' });
    expect(response.status).toBe(503);
  });
});
