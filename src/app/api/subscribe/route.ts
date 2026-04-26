import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  createRateLimitResponse,
  createSecureErrorResponse,
  validators,
  parseJsonBody,
  logSecurityEvent,
  SECURITY_CONSTANTS,
} from '@/utils/security';
import { logApiEvent, logStructured } from '@/utils/logger';

type SubscribeBody = {
  email?: unknown;
  /** Honeypot — must stay empty */
  company?: unknown;
  website?: unknown;
};

function extractConvertKitMessage(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return '';
  }
  const rec = data as Record<string, unknown>;
  if (typeof rec.message === 'string') {
    return rec.message;
  }
  const err = rec.error;
  if (typeof err === 'string') {
    return err;
  }
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  return '';
}

function isAlreadySubscribedMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes('already subscribed') ||
    m.includes('already a subscriber') ||
    m.includes('subscriber already') ||
    m.includes('already exists')
  );
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(
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

    const bodyResult = await parseJsonBody<SubscribeBody>(req);
    if (!bodyResult.valid) {
      return createSecureErrorResponse(
        bodyResult.error?.includes('too large') ? 'Request too large' : 'Invalid request body',
        bodyResult.error?.includes('too large') ? 413 : 400
      );
    }

    const { email, company, website } = bodyResult.data ?? {};
    const honeypot =
      (typeof company === 'string' && company.trim()) ||
      (typeof website === 'string' && website.trim());
    if (honeypot) {
      logStructured('warn', 'subscribe_honeypot_triggered', {
        endpoint: '/api/subscribe',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });
      return NextResponse.json({ success: true });
    }

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
        const data: unknown = await response.json().catch(() => ({}));
        const message = extractConvertKitMessage(data);
        if (isAlreadySubscribedMessage(message)) {
          return NextResponse.json({ success: true, alreadySubscribed: true });
        }
        logApiEvent('error', '/api/subscribe', 'convertkit_error_response', {
          status: response.status,
          responseData: data,
        });
        const clientMessage =
          response.status === 400 && message
            ? 'Please check your email address and try again.'
            : 'Failed to subscribe';
        return createSecureErrorResponse(clientMessage, 502);
      }

      return NextResponse.json({ success: true });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        logApiEvent('error', '/api/subscribe', 'convertkit_timeout');
        return createSecureErrorResponse('Request timeout', 504);
      }

      logApiEvent('error', '/api/subscribe', 'convertkit_request_failed', {
        message: fetchError instanceof Error ? fetchError.message : 'unknown',
      });
      return createSecureErrorResponse('Failed to subscribe', 502);
    }
  } catch (error) {
    logApiEvent('error', '/api/subscribe', 'subscribe_unhandled_error', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return createSecureErrorResponse('Service temporarily unavailable', 500);
  }
}
