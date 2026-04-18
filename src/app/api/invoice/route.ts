import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';
import {
  rateLimit,
  createRateLimitResponse,
  createSecureErrorResponse,
  validators,
  parseJsonBody,
  logSecurityEvent,
  getClientIP,
  SECURITY_CONSTANTS,
} from '@/utils/security';
import { trackPaymentAttempt } from '@/utils/lnurl-config';

// Ensure global WebSocket is available for Nostr Wallet Connect
declare global {
  interface GlobalThis {
    WebSocket: any;
  }
}
globalThis.WebSocket = WebSocket as any;

import { NWCClient } from '@getalby/sdk';
const NWC_URL = process.env.NOSTR_WALLET_CONNECT_URL || '';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting - stricter for invoice creation
    const rateLimitResult = await rateLimit(
      request,
      SECURITY_CONSTANTS.RATE_LIMIT_INVOICE,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      'invoice'
    );
    if (!rateLimitResult.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint: '/api/invoice',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    const bodyResult = await parseJsonBody<{
      amount?: unknown;
      memo?: unknown;
    }>(request);
    if (!bodyResult.valid) {
      return createSecureErrorResponse(
        bodyResult.error?.includes('too large') ? 'Request too large' : 'Invalid request body',
        bodyResult.error?.includes('too large') ? 413 : 400
      );
    }

    const { amount, memo } = bodyResult.data ?? {};

    // Validate amount using security utilities
    const amountValidation = validators.lightningAmount(amount, 'sats');
    if (!amountValidation.valid) {
      logSecurityEvent('invalid_input', {
        endpoint: '/api/invoice',
        reason: amountValidation.error,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });
      return createSecureErrorResponse(amountValidation.error, 400);
    }

    // Validate memo
    const memoValidation = validators.text(memo, SECURITY_CONSTANTS.MAX_MEMO_LENGTH);
    if (!memoValidation.valid) {
      return createSecureErrorResponse(memoValidation.error, 400);
    }

    if (!NWC_URL) {
      return createSecureErrorResponse('Service temporarily unavailable', 503, 'Missing NWC_URL');
    }

    const client = new NWCClient({ nostrWalletConnectUrl: NWC_URL });
    const satsAmount = amountValidation.sanitized!;

    try {
      const result = await client.makeInvoice({
        amount: satsAmount * 1000,
        description: memoValidation.sanitized || 'Lightning Tip Jar',
      });

      const paymentRequest = result.invoice;
      const paymentHash = result.payment_hash;

      // Track payment attempt for security monitoring
      const clientIP = getClientIP(request);
      const trackingAllowed = trackPaymentAttempt(paymentHash, satsAmount, clientIP);

      if (!trackingAllowed) {
        logSecurityEvent('suspicious_request', {
          endpoint: '/api/invoice',
          reason: 'Rapid payment attempts detected',
          ip: clientIP,
        });
        return createSecureErrorResponse('Too many rapid attempts', 429);
      }

      return NextResponse.json({ paymentRequest, paymentHash });
    } catch (apiError) {
      console.error(
        'Nostr Wallet Connect makeInvoice error:',
        apiError instanceof Error ? apiError.message : 'Unknown error'
      );
      return createSecureErrorResponse('Unable to process payment request', 503);
    }
  } catch (error) {
    console.error(
      'Error creating invoice:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return createSecureErrorResponse('Failed to create invoice', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for payment status checks
    const rateLimitResult = await rateLimit(
      request,
      SECURITY_CONSTANTS.RATE_LIMIT_API,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      'invoice-status'
    );
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    const { searchParams } = new URL(request.url);
    const paymentHash = searchParams.get('paymentHash');

    if (!paymentHash) {
      return createSecureErrorResponse('Payment hash is required', 400);
    }

    // Validate payment hash format
    const hashValidation = validators.paymentHash(paymentHash);
    if (!hashValidation.valid) {
      logSecurityEvent('invalid_input', {
        endpoint: '/api/invoice (GET)',
        reason: hashValidation.error,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });
      return createSecureErrorResponse('Invalid payment hash format', 400);
    }

    if (!NWC_URL) {
      return createSecureErrorResponse('Service temporarily unavailable', 503, 'Missing NWC_URL');
    }

    const client = new NWCClient({ nostrWalletConnectUrl: NWC_URL });
    try {
      const status = await client.lookupInvoice({ payment_hash: hashValidation.sanitized });
      // invoice is settled if settled_at timestamp is present
      const paid = Boolean(status.settled_at);
      const preimage = status.preimage || null;
      return NextResponse.json({ paid, preimage });
    } catch (apiError) {
      console.error(
        'Nostr Wallet Connect lookupInvoice error:',
        apiError instanceof Error ? apiError.message : 'Unknown error'
      );

      // For payment status checks, we return a "not paid" status rather than an error
      // This allows the UI to continue polling without showing an error
      return NextResponse.json({
        paid: false,
        error: 'Unable to verify payment status. Will try again.',
      });
    }
  } catch (error) {
    console.error(
      'Error checking invoice status:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return NextResponse.json(
      { paid: false },
      { status: 200 } // Return 200 to avoid breaking the polling loop
    );
  }
}
