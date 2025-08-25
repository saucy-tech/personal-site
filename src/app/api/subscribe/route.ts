import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  createRateLimitResponse,
  createSecureErrorResponse,
  validators,
  validateRequestSize,
  logSecurityEvent,
  SECURITY_CONSTANTS,
} from '@/utils/security';

export async function POST(req: NextRequest) {
  try {
    // Validate request size
    const sizeValidation = await validateRequestSize(req);
    if (!sizeValidation.valid) {
      return createSecureErrorResponse('Request too large', 413);
    }

    // Apply rate limiting - strict for subscription requests
    const rateLimitResult = rateLimit(
      req,
      SECURITY_CONSTANTS.RATE_LIMIT_SUBSCRIBE,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      'subscribe'
    );
    if (!rateLimitResult.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint: '/api/subscribe',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      });
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    const { email } = await req.json();

    // Validate email using security utilities
    const emailValidation = validators.email(email);
    if (!emailValidation.valid) {
      logSecurityEvent('invalid_input', {
        endpoint: '/api/subscribe',
        reason: emailValidation.error,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });
      return createSecureErrorResponse(emailValidation.error, 400);
    }

    const formId = process.env.CONVERTKIT_FORM_ID;
    const apiKey = process.env.CONVERTKIT_API_KEY;
    if (!formId || !apiKey) {
      return createSecureErrorResponse(
        'Service temporarily unavailable',
        503,
        'ConvertKit not configured'
      );
    }

    // Add timeout to external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SECURITY_CONSTANTS.REQUEST_TIMEOUT);

    try {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Personal-Site/1.0',
        },
        body: JSON.stringify({
          email: emailValidation.sanitized,
          api_key: apiKey,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('ConvertKit API error:', response.status, data);
        return createSecureErrorResponse('Failed to subscribe', 502);
      }

      return NextResponse.json({ success: true });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('ConvertKit API timeout');
        return createSecureErrorResponse('Request timeout', 504);
      }

      console.error('Error calling ConvertKit API:', fetchError);
      return createSecureErrorResponse('Failed to subscribe', 502);
    }
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return createSecureErrorResponse('Service temporarily unavailable', 500);
  }
}
