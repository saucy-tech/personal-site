export async function GET() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch price' }), { status: 502 });
    }
    const data = await response.json();
    return new Response(JSON.stringify({ usd: data.bitcoin.usd }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
