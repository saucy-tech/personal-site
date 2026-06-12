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
import { SITE_URL } from '@/utils/constants';

type SubscribeBody = {
  email?: unknown;
  /** Honeypot — must stay empty */
  company?: unknown;
  website?: unknown;
};

function extractKitErrors(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return '';
  }
  const errors = (data as Record<string, unknown>).errors;
  if (Array.isArray(errors)) {
    return errors.filter((e): e is string => typeof e === 'string').join('; ');
  }
  return '';
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
      // Kit v4 API: upsert the subscriber, then attach them to the form.
      const kitHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': 'Personal-Site/1.0',
        'X-Kit-Api-Key': apiKey,
      };

      const createResponse = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: kitHeaders,
        body: JSON.stringify({ email_address: emailValidation.sanitized }),
        signal: controller.signal,
      });

      const createData: unknown = await createResponse.json().catch(() => ({}));

      if (!createResponse.ok) {
        logApiEvent('error', '/api/subscribe', 'kit_create_subscriber_error', {
          status: createResponse.status,
          responseData: createData,
        });
        const clientMessage =
          createResponse.status === 422 && extractKitErrors(createData)
            ? 'Please check your email address and try again.'
            : 'Failed to subscribe';
        clearTimeout(timeoutId);
        return createSecureErrorResponse(clientMessage, 502);
      }

      const subscriberId = (createData as { subscriber?: { id?: unknown } })?.subscriber?.id;
      if (typeof subscriberId !== 'number') {
        clearTimeout(timeoutId);
        logApiEvent('error', '/api/subscribe', 'kit_invalid_subscriber_payload', {
          responseData: createData,
        });
        return createSecureErrorResponse('Failed to subscribe', 502);
      }

      const referrer = req.headers.get('referer') || SITE_URL;
      const formResponse = await fetch(
        `https://api.kit.com/v4/forms/${formId}/subscribers/${subscriberId}`,
        {
          method: 'POST',
          headers: kitHeaders,
          body: JSON.stringify({ referrer }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!formResponse.ok) {
        const formData: unknown = await formResponse.json().catch(() => ({}));
        logApiEvent('error', '/api/subscribe', 'kit_add_to_form_error', {
          status: formResponse.status,
          responseData: formData,
        });
        return createSecureErrorResponse('Failed to subscribe', 502);
      }

      // 200 = was already on the form; 201 = newly added.
      if (formResponse.status === 200) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
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
