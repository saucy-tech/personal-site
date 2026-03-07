import { NextResponse } from 'next/server';
import { SITE_URL } from '@/utils/constants';
import { LNURL_CONFIG } from '@/utils/lnurl-config';

export async function GET() {
  const username = 'brandon';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || SITE_URL;

  const responseData = {
    callback: `${appUrl}/api/lnurlp/${username}/callback`,
    maxSendable: LNURL_CONFIG.maxSendable,
    minSendable: LNURL_CONFIG.minSendable,
    metadata: LNURL_CONFIG.metadata,
    tag: LNURL_CONFIG.tag,
    commentAllowed: LNURL_CONFIG.commentAllowed,
  };

  return NextResponse.json(responseData);
}
