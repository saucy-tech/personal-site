import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  createRateLimitResponse,
  createSecureErrorResponse,
  logSecurityEvent,
  SECURITY_CONSTANTS,
} from '@/utils/security';
import { logApiEvent } from '@/utils/logger';

let cachedRate: number | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS = 60 * 1000; // 1 minute in-process (CDN cache headers still apply)
const EDGE_CACHE_CONTROL =
  'public, max-age=60, s-maxage=300, stale-while-revalidate=600, stale-if-error=1800';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for BTC price requests
    const rateLimitResult = await rateLimit(
      request,
      SECURITY_CONSTANTS.RATE_LIMIT_API,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      'btcusd'
    );
    if (!rateLimitResult.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint: '/api/btcusd',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    const now = Date.now();
    if (cachedRate !== null && lastFetchTime !== null && now - lastFetchTime < CACHE_DURATION_MS) {
      return NextResponse.json(
        { usd: cachedRate },
        {
          status: 200,
          headers: {
            'X-Cache-Status': 'HIT',
            'Cache-Control': EDGE_CACHE_CONTROL,
          },
        }
      );
    }

    // Add timeout to external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SECURITY_CONSTANTS.REQUEST_TIMEOUT);

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Personal-Site/1.0',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        logApiEvent('error', '/api/btcusd', 'coingecko_error_response', {
          status: response.status,
          statusText: response.statusText,
        });
        return createSecureErrorResponse('Failed to fetch price data', 502);
      }

      const data = await response.json();

      // Validate response structure
      if (data && data.bitcoin && typeof data.bitcoin.usd === 'number' && data.bitcoin.usd > 0) {
        cachedRate = data.bitcoin.usd;
        lastFetchTime = Date.now();
        return NextResponse.json(
          { usd: cachedRate },
          {
            status: 200,
            headers: {
              'X-Cache-Status': 'MISS',
              'Cache-Control': EDGE_CACHE_CONTROL,
            },
          }
        );
      } else {
        // If CoinGecko's response format is unexpected, return an error
        logApiEvent('error', '/api/btcusd', 'coingecko_invalid_payload', {
          responseData: data,
        });
        return createSecureErrorResponse(
          'Failed to parse price data',
          502,
          'Invalid CoinGecko response format'
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        logApiEvent('error', '/api/btcusd', 'coingecko_timeout');
        return createSecureErrorResponse('Price data request timeout', 504);
      }

      logApiEvent('error', '/api/btcusd', 'coingecko_request_failed', {
        message: fetchError instanceof Error ? fetchError.message : 'unknown',
      });
      return createSecureErrorResponse('Failed to fetch price data', 502);
    }
  } catch (err) {
    logApiEvent('error', '/api/btcusd', 'btcusd_unhandled_error', {
      message: err instanceof Error ? err.message : 'unknown',
    });
    return createSecureErrorResponse('Service temporarily unavailable', 500);
  }
}
