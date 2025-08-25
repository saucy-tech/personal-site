import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/utils/security';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Get security headers (CSP is environment-aware; no nonce required)
  const securityHeaders = getSecurityHeaders();

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

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
