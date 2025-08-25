import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, generateCSPNonce } from '@/utils/security';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Generate CSP nonce for this request
  const nonce = generateCSPNonce();

  // Get security headers with nonce
  const securityHeaders = getSecurityHeaders(nonce);

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Store nonce for use in components (if needed)
  response.headers.set('X-CSP-Nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
