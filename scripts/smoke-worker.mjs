// Exercise the built Cloudflare Worker, not `next start`: adapter startup
// failures (such as a missing preview-props manifest) only happen at runtime.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const base = 'http://127.0.0.1:8787';
const child = spawn(
  'pnpm',
  ['exec', 'wrangler', 'dev', '--local', '--ip', '127.0.0.1', '--port', '8787'],
  {
    stdio: 'inherit',
    detached: true,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
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
