// LNURL-p endpoint: /.well-known/lnurlp/brandon
// This will handle the first step of the LNURL-p flow.

import { NextResponse } from 'next/server';

export async function GET() {
  const username = 'brandon'; // Your chosen username
  // It's best to set NEXT_PUBLIC_APP_URL in your .env.local file (e.g., NEXT_PUBLIC_APP_URL=https://yourdomain.com)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Fallback for local dev

  // Construct the metadata for the LNURL-p response
  // Amounts are in millisatoshis (msats)
  const metadata = JSON.stringify([
    ['text/plain', `Tip ${username}@${appUrl.replace(/^https?:\/\//, '')}`], // Display address without scheme
    // Optional: Add an image for your Lightning Address. Example:
    // ['image/jpeg;base64', 'your_base64_encoded_image_string_here'],
    // ['image/png;base64', 'your_base64_encoded_image_string_here'],
  ]);

  const responseData = {
    callback: `${appUrl}/api/lnurlp/${username}/callback`, // The callback URL on your server
    maxSendable: 1000000000, // Example: 1,000,000 sats (1 billion msats)
    minSendable: 1000, // Example: 1 sat (1000 msats)
    metadata: metadata,
    tag: 'payRequest',
    // nostrPubkey: 'your_nostr_hex_pubkey', // Optional: Your Nostr public key for Zaps
    // commentAllowed: 256, // Optional: Max length of comment allowed by payer's wallet
  };

  return NextResponse.json(responseData);
}
