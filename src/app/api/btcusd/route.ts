import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  createRateLimitResponse,
  createSecureErrorResponse,
  logSecurityEvent,
  SECURITY_CONSTANTS,
} from '@/utils/security';

let cachedRate: number | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for BTC price requests
    const rateLimitResult = rateLimit(
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
          headers: { 'X-Cache-Status': 'HIT' },
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
        console.error('CoinGecko API error:', response.status, response.statusText);
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
            headers: { 'X-Cache-Status': 'MISS' },
          }
        );
      } else {
        // If CoinGecko's response format is unexpected, return an error
        console.error('Unexpected response format from CoinGecko:', data);
        return createSecureErrorResponse(
          'Failed to parse price data',
          502,
          'Invalid CoinGecko response format'
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('CoinGecko API timeout');
        return createSecureErrorResponse('Price data request timeout', 504);
      }

      console.error('Error fetching from CoinGecko:', fetchError);
      return createSecureErrorResponse('Failed to fetch price data', 502);
    }
  } catch (err) {
    console.error('Error in BTC/USD endpoint:', err);
    return createSecureErrorResponse('Service temporarily unavailable', 500);
  }
}
