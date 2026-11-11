// Exercise the built Cloudflare Worker, not `next start`: adapter startup
// failures (such as a missing preview-props manifest) only happen at runtime.
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const base = 'http://127.0.0.1:8787';
const env = { ...process.env, WRANGLER_SEND_METRICS: 'false' };
// Match OpenNext preview/upload preparation before exercising the slimmed OG bundle.
execFileSync('pnpm', ['exec', 'opennextjs-cloudflare', 'populateCache', 'local'], {
  stdio: 'inherit',
  env,
});
const child = spawn(
  'pnpm',
  ['exec', 'wrangler', 'dev', '--local', '--ip', '127.0.0.1', '--port', '8787'],
  {
    stdio: 'inherit',
    detached: true,
    env,
  }
);
let startupError;
child.on('error', (error) => {
  startupError = error;
});

try {
  const deadline = Date.now() + 120_000;
  let ready = false;
  while (Date.now() < deadline) {
    if (startupError) throw startupError;
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error('Worker preview exited before becoming ready');
    }
    try {
      // Any HTTP response means the listener is ready. Do not retry 500s.
      await fetch(base, { signal: AbortSignal.timeout(2_000) });
      ready = true;
      break;
    } catch {
      await delay(500);
    }
  }
  assert.ok(ready, 'Worker preview did not start within 120 seconds');
  for (const [path, status, content] of [
    ['/', 200, 'Brandon'],
    ['/portfolio', 200, 'Portfolio'],
    ['/about', 200, 'About'],
    ['/notes', 200, 'Notes'],
    ['/blog', 200, 'Articles'],
    ['/blog/2026-03-04-for-god-so-loved', 200, 'For God So Loved'],
    ['/rss.xml', 200, '<rss'],
    ['/sitemap.xml', 200, '<urlset'],
    ['/api/subscribe', 405, null],
    ['/__worker_smoke_missing__', 404, null],
  ]) {
    const response = await fetch(`${base}${path}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    assert.equal(response.status, status, `${path}: ${body.slice(0, 300)}`);
    if (content) assert.ok(body.includes(content), `${path}: expected ${content}`);
    console.log(`Worker smoke: GET ${path} -> ${response.status}`);
  }
  // Share-card tags: a page-level `openGraph` replaces the layout's, so check
  // the pages that rely on the site-wide default still emit a full set.
  for (const path of ['/', '/blog', '/daily-word', '/links']) {
    const html = await (
      await fetch(`${base}${path}`, { signal: AbortSignal.timeout(15_000) })
    ).text();
    for (const tag of [
      'property="og:image" content="https://saucy.tech/opengraph-image"',
      'property="og:image:width" content="1200"',
      'property="og:image:height" content="630"',
      'property="og:image:alt"',
      'property="og:type" content="website"',
      'property="og:site_name"',
      'property="og:locale" content="en_US"',
      'name="twitter:card" content="summary_large_image"',
      'name="twitter:image" content="https://saucy.tech/opengraph-image"',
    ]) {
      assert.ok(html.includes(tag), `${path}: missing ${tag}`);
    }
    console.log(`Worker smoke: GET ${path} -> share-card tags present`);
  }
  for (const [path, contentType] of [
    ['/headshot.jpeg', 'image/jpeg'],
    ['/images/products/morning-portion.webp', 'image/webp'],
    ['/opengraph-image', 'image/png'],
    ['/portfolio/opengraph-image', 'image/png'],
    ['/notes/opengraph-image', 'image/png'],
    ['/blog/2026-03-04-for-god-so-loved/opengraph-image', 'image/png'],
  ]) {
    const response = await fetch(`${base}${path}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type')?.includes(contentType), path);
    const body = new Uint8Array(await response.arrayBuffer());
    assert.ok(body.length > 1_000, `${path}: image is missing or truncated`);
    console.log(`Worker smoke: GET ${path} -> 200 (${body.length} bytes)`);
  }
} finally {
  // Stop pnpm, Wrangler and workerd, including when an assertion fails.
  if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
}
