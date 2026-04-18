// LNURL-p callback endpoint: /api/lnurlp/brandon/callback
// This handles the second step of the LNURL-p flow, generating the invoice.

import { NextRequest, NextResponse } from 'next/server';
import { NWCClient } from '@getalby/sdk';
import { validateLnurlAmount } from '@/utils/lnurl-config';
import {
  rateLimit,
  createRateLimitResponse,
  validators,
  logSecurityEvent,
  SECURITY_CONSTANTS,
} from '@/utils/security';

const NWC_URL = process.env.NOSTR_WALLET_CONNECT_URL;

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for LNURL callback
    const rateLimitResult = await rateLimit(
      request,
      SECURITY_CONSTANTS.RATE_LIMIT_INVOICE,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      'lnurl-callback'
    );
    if (!rateLimitResult.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint: '/api/lnurlp/brandon/callback',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    if (!NWC_URL) {
      console.error('NOSTR_WALLET_CONNECT_URL is not set');
      return NextResponse.json(
        { status: 'ERROR', reason: 'Service configuration error.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const amountMsatsStr = searchParams.get('amount');
    const comment = searchParams.get('comment');
    // const nostrZapEvent = searchParams.get('nostr'); // For Zaps, if you implement them

    if (!amountMsatsStr) {
      return NextResponse.json(
        { status: 'ERROR', reason: 'Amount parameter is missing.' },
        { status: 400 }
      );
    }

    const amountMsats = parseInt(amountMsatsStr, 10);

    // Validate amount using security utilities
    const amountValidation = validators.lightningAmount(amountMsats, 'msats');
    if (!amountValidation.valid) {
      logSecurityEvent('invalid_input', {
        endpoint: '/api/lnurlp/brandon/callback',
        reason: amountValidation.error,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });
      return NextResponse.json(
        {
          status: 'ERROR',
          reason: amountValidation.error,
        },
        { status: 400 }
      );
    }

    // Validate amount using centralized LNURL configuration
    const validation = validateLnurlAmount(amountMsats);
    if (!validation.valid) {
      return NextResponse.json({ status: 'ERROR', reason: validation.error }, { status: 400 });
    }

    // Validate comment if provided
    let sanitizedComment = '';
    if (comment) {
      const commentValidation = validators.text(comment, SECURITY_CONSTANTS.MAX_COMMENT_LENGTH);
      if (!commentValidation.valid) {
        return NextResponse.json(
          {
            status: 'ERROR',
            reason: commentValidation.error,
          },
          { status: 400 }
        );
      }
      sanitizedComment = commentValidation.sanitized || '';
    }

    const client = new NWCClient({ nostrWalletConnectUrl: NWC_URL });
    const description = sanitizedComment || `Tip to brandon`;

    const invoiceResult = await client.makeInvoice({
      amount: amountValidation.sanitized!, // NWCClient expects amount in msats
      description: description,
      // You could add other parameters like expiry here if needed
    });

    if (!invoiceResult || !invoiceResult.invoice) {
      throw new Error('Failed to generate invoice from NWC provider.');
    }

    const responseData = {
      pr: invoiceResult.invoice, // The BOLT-11 payment request
      routes: [], // Optional: for more advanced payment routing, usually empty
      // successAction: { tag: 'message', message: 'Payment successful! Thanks!' } // Optional
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error generating LNURL invoice:', error);
    let reason = 'Failed to generate invoice.';
    if (error instanceof Error) {
      // Don't expose internal error details
      reason = 'Unable to process payment request.';
    }
    return NextResponse.json({ status: 'ERROR', reason }, { status: 500 });
  }
}
