let cachedRate: number | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedRate !== null && lastFetchTime !== null && now - lastFetchTime < CACHE_DURATION_MS) {
      return new Response(JSON.stringify({ usd: cachedRate }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache-Status': 'HIT' },
      });
    }

    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch price' }), { status: 502 });
    }
    const data = await response.json();
    if (data && data.bitcoin && typeof data.bitcoin.usd === 'number') {
      cachedRate = data.bitcoin.usd;
      lastFetchTime = Date.now();
      return new Response(JSON.stringify({ usd: cachedRate }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache-Status': 'MISS' },
      });
    } else {
      // If CoinGecko's response format is unexpected, return an error
      // but don't overwrite a potentially stale but valid cache if we have one.
      console.error('Unexpected response format from CoinGecko:', data);
      return new Response(JSON.stringify({ error: 'Failed to parse price data' }), { status: 502 });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
