import { NextRequest, NextResponse } from 'next/server';

import { logStructured } from '@/utils/logger';
import { getSiteUrl } from '@/utils/constants';

function isOurUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const site = new URL(getSiteUrl());
    return u.hostname === site.hostname;
  } catch {
    return false;
  }
}

/**
 * Minimal Webmention receiver: validates target is this site, logs source for later integration.
 * @see https://www.w3.org/TR/webmention/
 */
export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';

  let source = '';
  let target = '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    source = String(form.get('source') ?? '');
    target = String(form.get('target') ?? '');
  } else if (contentType.includes('application/json')) {
    const json = (await request.json().catch(() => null)) as {
      source?: string;
      target?: string;
    } | null;
    source = json?.source ?? '';
    target = json?.target ?? '';
  } else {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
  }

  if (!source || !target) {
    return NextResponse.json({ error: 'source and target are required' }, { status: 400 });
  }

  if (!isOurUrl(target)) {
    return NextResponse.json({ error: 'target must be on this site' }, { status: 400 });
  }

  logStructured('info', 'webmention_received', { source, target });
  return NextResponse.json({ status: 'accepted' }, { status: 202 });
}
