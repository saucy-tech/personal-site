// LNURL-p callback endpoint: /api/lnurlp/brandon/callback
// This handles the second step of the LNURL-p flow, generating the invoice.

import { nwc } from '@getalby/sdk';
import { NextRequest, NextResponse } from 'next/server';

const NWC_URL = process.env.NOSTR_WALLET_CONNECT_URL;

export async function GET(request: NextRequest) {
  if (!NWC_URL) {
    console.error('NOSTR_WALLET_CONNECT_URL is not set');
    return NextResponse.json(
      { status: 'ERROR', reason: 'Service configuration error: NWC_URL missing.' },
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
  if (isNaN(amountMsats) || amountMsats <= 0) {
    return NextResponse.json({ status: 'ERROR', reason: 'Invalid amount.' }, { status: 400 });
  }

  // TODO: Validate amountMsats against minSendable/maxSendable from the initial LNURL-p response.
  // For example, fetch these values or have them configured here as well.
  const minSendable = 1000; // Should match what's in /.well-known/lnurlp/brandon/route.ts
  const maxSendable = 1000000000; // Should match

  if (amountMsats < minSendable || amountMsats > maxSendable) {
    return NextResponse.json(
      {
        status: 'ERROR',
        reason: `Amount must be between ${minSendable} and ${maxSendable} msats.`,
      },
      { status: 400 }
    );
  }

  try {
    const client = new nwc.NWCClient({ nostrWalletConnectUrl: NWC_URL });
    const description = comment || `Tip to brandon`; // Customize as needed

    const invoiceResult = await client.makeInvoice({
      amount: amountMsats, // NWCClient expects amount in msats
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
      reason = error.message;
    }
    return NextResponse.json({ status: 'ERROR', reason }, { status: 500 });
  }
}
