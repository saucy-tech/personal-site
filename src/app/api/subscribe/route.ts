import { NextResponse } from 'next/server';

// VERY simple in-memory rate limiter (per edge/server instance). Good enough for hobby use.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per IP per window
const requests: Map<string, { count: number; expires: number }> = new Map();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Basic rate-limit by IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const bucket = requests.get(ip);
    if (bucket && bucket.expires > now) {
      if (bucket.count >= RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      bucket.count += 1;
    } else {
      requests.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS });
    }

    const formId = process.env.CONVERTKIT_FORM_ID;
    const apiKey = process.env.CONVERTKIT_API_KEY;
    if (!formId || !apiKey) {
      return NextResponse.json({ error: 'ConvertKit not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, api_key: apiKey }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ error: data?.message ?? 'ConvertKit error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
