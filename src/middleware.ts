import { NextRequest, NextResponse } from 'next/server';
import { generateCSPNonce, getSecurityHeaders } from '@/utils/security';

export function middleware(request: NextRequest) {
  const nonce = generateCSPNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Get security headers with request-specific nonce for inline scripts.
  const securityHeaders = getSecurityHeaders({ nonce });

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     *
     * `api` used to be excluded here with the comment "handled separately".
     * Nothing handled them separately: every route handler returns a bare
     * NextResponse.json(), so no API response carried nosniff, HSTS, frame
     * protection or a CSP. A page CSP is harmless on a JSON response, and
     * nosniff on one is worth having, so they go through the same path.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
