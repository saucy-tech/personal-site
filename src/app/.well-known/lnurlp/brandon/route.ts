import { NextResponse } from 'next/server';
import { SITE_URL } from '@/utils/constants';
import { LNURL_CONFIG } from '@/utils/lnurl-config';

export async function GET() {
  const username = 'brandon';

  const responseData = {
    callback: `${SITE_URL}/api/lnurlp/${username}/callback`,
    maxSendable: LNURL_CONFIG.maxSendable,
    minSendable: LNURL_CONFIG.minSendable,
    metadata: LNURL_CONFIG.metadata,
    tag: LNURL_CONFIG.tag,
    commentAllowed: LNURL_CONFIG.commentAllowed,
  };

  return NextResponse.json(responseData);
}
