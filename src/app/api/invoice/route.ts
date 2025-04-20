import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error no type declarations for ws
import WebSocket from 'ws';

// Ensure global WebSocket is available for Nostr Wallet Connect
declare global {
  interface GlobalThis {
    WebSocket: typeof WebSocket;
  }
}
globalThis.WebSocket = WebSocket;

import { nwc } from '@getalby/sdk';
const NWC_URL = process.env.NOSTR_WALLET_CONNECT_URL || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, memo } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Please provide a positive number.' },
        { status: 400 }
      );
    }

    if (!NWC_URL) {
      return NextResponse.json({ error: 'Missing Nostr Wallet Connect URL' }, { status: 500 });
    }
    const client = new nwc.NWCClient({ nostrWalletConnectUrl: NWC_URL });

    const satsAmount = Number(amount);

    try {
      const result = await client.makeInvoice({
        amount: satsAmount * 1000,
        description: memo || 'Lightning Tip Jar',
      });
      const paymentRequest = result.invoice;
      const paymentHash = result.payment_hash;
      return NextResponse.json({ paymentRequest, paymentHash });
    } catch (apiError) {
      console.error(
        'Nostr Wallet Connect makeInvoice error:',
        apiError instanceof Error ? apiError.message : 'Unknown error'
      );
      return NextResponse.json(
        {
          error: 'Unable to connect to the Lightning Network. Please try again later.',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error(
      'Error creating invoice:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return NextResponse.json(
      { error: 'Failed to create invoice. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentHash = searchParams.get('paymentHash');

    if (!paymentHash) {
      return NextResponse.json({ error: 'Payment hash is required' }, { status: 400 });
    }

    if (!NWC_URL) {
      return NextResponse.json({ error: 'Missing Nostr Wallet Connect URL' }, { status: 500 });
    }
    const client = new nwc.NWCClient({ nostrWalletConnectUrl: NWC_URL });
    try {
      const status = await client.lookupInvoice({ payment_hash: paymentHash });
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
