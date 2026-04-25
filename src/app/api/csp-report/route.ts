import { NextRequest, NextResponse } from 'next/server';

import { logStructured } from '@/utils/logger';

/**
 * CSP violation reports (legacy report-uri). Keep payload size bounded.
 */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    const max = 16_384;
    const body = raw.length > max ? `${raw.slice(0, max)}…` : raw;
    logStructured('warn', 'csp_violation_report', {
      contentType: request.headers.get('content-type'),
      body,
    });
  } catch {
    // ignore parse errors
  }
  return new NextResponse(null, { status: 204 });
}
