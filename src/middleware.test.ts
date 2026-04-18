/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { config, middleware } from '@/middleware';

describe('middleware', () => {
  it('sets CSP nonce and security headers', () => {
    const request = new NextRequest('http://localhost/blog');
    const response = middleware(request);

    expect(response.headers.get('Content-Security-Policy')).toContain('script-src');
    expect(response.headers.get('x-nonce')).toBeTruthy();
    expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=');
  });

  it('uses extension-based matcher exclusion for static assets', () => {
    expect(config.matcher[0]).toContain('.*\\..*');
  });
});
