/**
 * @jest-environment node
 */
import {
  validators,
  rateLimit,
  SECURITY_CONSTANTS,
  parseJsonBody,
  getSecurityHeaders,
  getSecurityHeaderDriftIssues,
  assertSecurityHeadersHaveRequiredDirectives,
} from '@/utils/security';
import { NextRequest } from 'next/server';

// Helper to build a minimal request with a given IP
function makeRequest(ip: string): NextRequest {
  return new NextRequest('http://localhost/', {
    headers: { 'x-forwarded-for': ip },
  });
}

// Generate a unique IP per test group to avoid rate-limit store pollution
let ipCounter = 1;
function uniqueIP(): string {
  return `10.0.${Math.floor(ipCounter / 255)}.${ipCounter++ % 255}`;
}

// ---------------------------------------------------------------------------
// validators.email
// ---------------------------------------------------------------------------

describe('validators.email', () => {
  it('accepts a valid email', () => {
    const result = validators.email('user@example.com');
    expect(result).toEqual({ valid: true, sanitized: 'user@example.com' });
  });

  it('normalises uppercase to lowercase', () => {
    const result = validators.email('User@EXAMPLE.COM');
    expect(result).toEqual({ valid: true, sanitized: 'user@example.com' });
  });

  it('trims surrounding whitespace', () => {
    const result = validators.email('  user@example.com  ');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('user@example.com');
  });

  it('rejects an empty string', () => {
    const result = validators.email('');
    expect(result.valid).toBe(false);
  });

  it('rejects a non-string input (number)', () => {
    const result = validators.email(42);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/string/i);
  });

  it('rejects an address missing @', () => {
    const result = validators.email('notanemail.com');
    expect(result.valid).toBe(false);
  });

  it('rejects an XSS attempt', () => {
    const result = validators.email('<script>alert(1)</script>@evil.com');
    expect(result.valid).toBe(false);
  });

  it('rejects an email longer than 254 characters', () => {
    const local = 'a'.repeat(250);
    const result = validators.email(`${local}@example.com`);
    expect(result.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// validators.lightningAmount
// ---------------------------------------------------------------------------

describe('validators.lightningAmount', () => {
  it('accepts a valid integer amount in sats', () => {
    const result = validators.lightningAmount(1000);
    expect(result).toEqual({ valid: true, sanitized: 1000 });
  });

  it('rejects zero', () => {
    const result = validators.lightningAmount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/positive/i);
  });

  it('rejects a negative amount', () => {
    const result = validators.lightningAmount(-10);
    expect(result.valid).toBe(false);
  });

  it('rejects a fractional amount (1.5 sats)', () => {
    const result = validators.lightningAmount(1.5);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/whole number/i);
  });

  it('accepts a numeric string', () => {
    const result = validators.lightningAmount('500');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe(500);
  });

  it('rejects a non-numeric string', () => {
    const result = validators.lightningAmount('abc');
    expect(result.valid).toBe(false);
  });

  it('rejects null', () => {
    const result = validators.lightningAmount(null);
    expect(result.valid).toBe(false);
  });

  it('rejects an object', () => {
    const result = validators.lightningAmount({});
    expect(result.valid).toBe(false);
  });

  it('rejects an amount below the minimum when provided as fractional sats', () => {
    const result = validators.lightningAmount(0.5);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/whole number/i);
  });

  it('rejects an amount above the maximum', () => {
    const result = validators.lightningAmount(SECURITY_CONSTANTS.MAX_AMOUNT_SATS + 1);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/too large/i);
  });

  it('accepts an amount equal to the maximum', () => {
    const result = validators.lightningAmount(SECURITY_CONSTANTS.MAX_AMOUNT_SATS);
    expect(result.valid).toBe(true);
  });

  it('accepts 2000 msats (2 sats) with unit=msats', () => {
    const result = validators.lightningAmount(2000, 'msats');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe(2000);
  });
});

// ---------------------------------------------------------------------------
// validators.text
// ---------------------------------------------------------------------------

describe('validators.text', () => {
  it('passes normal text through trimmed', () => {
    const result = validators.text('  hello world  ');
    expect(result).toEqual({ valid: true, sanitized: 'hello world' });
  });

  it('accepts an empty string', () => {
    const result = validators.text('');
    expect(result).toEqual({ valid: true, sanitized: '' });
  });

  it('accepts null', () => {
    const result = validators.text(null);
    expect(result).toEqual({ valid: true, sanitized: '' });
  });

  it('accepts undefined', () => {
    const result = validators.text(undefined);
    expect(result).toEqual({ valid: true, sanitized: '' });
  });

  it('rejects text exceeding maxLength', () => {
    const long = 'x'.repeat(SECURITY_CONSTANTS.MAX_MEMO_LENGTH + 1);
    const result = validators.text(long);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/too long/i);
  });

  it('respects a custom maxLength', () => {
    const result = validators.text('hello world', 5);
    expect(result.valid).toBe(false);
  });

  it('strips null bytes and control characters', () => {
    const result = validators.text('hel\x00lo\x01world');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('helloworld');
  });

  it('preserves newlines and tabs (allowed control chars)', () => {
    const result = validators.text('line1\nline2\ttab');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toContain('\n');
    expect(result.sanitized).toContain('\t');
  });

  it('rejects a non-string value', () => {
    const result = validators.text(123);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/string/i);
  });
});

// ---------------------------------------------------------------------------
// validators.paymentHash
// ---------------------------------------------------------------------------

describe('validators.paymentHash', () => {
  const validHash = 'a'.repeat(64);

  it('accepts a valid 64-char lowercase hex hash', () => {
    const result = validators.paymentHash(validHash);
    expect(result).toEqual({ valid: true, sanitized: validHash });
  });

  it('normalises uppercase hex to lowercase', () => {
    const upper = 'A'.repeat(64);
    const result = validators.paymentHash(upper);
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe('a'.repeat(64));
  });

  it('rejects a hash that is too short (63 chars)', () => {
    const result = validators.paymentHash('a'.repeat(63));
    expect(result.valid).toBe(false);
  });

  it('rejects a hash that is too long (65 chars)', () => {
    const result = validators.paymentHash('a'.repeat(65));
    expect(result.valid).toBe(false);
  });

  it('rejects a hash containing non-hex characters', () => {
    const bad = 'g'.repeat(64);
    const result = validators.paymentHash(bad);
    expect(result.valid).toBe(false);
  });

  it('rejects a non-string input', () => {
    const result = validators.paymentHash(12345);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/string/i);
  });
});

// ---------------------------------------------------------------------------
// rateLimit
// ---------------------------------------------------------------------------

describe('rateLimit', () => {
  it('allows the first request and returns correct remaining count', async () => {
    const ip = uniqueIP();
    const req = makeRequest(ip);
    const maxRequests = 5;
    const result = await rateLimit(
      req,
      maxRequests,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      `rl-test-${ip}`
    );
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(maxRequests - 1);
  });

  it('allows requests up to the limit', async () => {
    const ip = uniqueIP();
    const prefix = `rl-test-${ip}`;
    const maxRequests = 3;
    for (let i = 0; i < maxRequests; i++) {
      const result = await rateLimit(
        makeRequest(ip),
        maxRequests,
        SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
        prefix
      );
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the request that exceeds the limit', async () => {
    const ip = uniqueIP();
    const prefix = `rl-test-${ip}`;
    const maxRequests = 3;
    for (let i = 0; i < maxRequests; i++) {
      await rateLimit(
        makeRequest(ip),
        maxRequests,
        SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
        prefix
      );
    }
    const result = await rateLimit(
      makeRequest(ip),
      maxRequests,
      SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
      prefix
    );
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after the window expires', async () => {
    jest.useFakeTimers();
    const ip = uniqueIP();
    const prefix = `rl-test-${ip}`;
    const maxRequests = 2;
    const windowMs = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS;

    // Exhaust the limit
    await rateLimit(makeRequest(ip), maxRequests, windowMs, prefix);
    await rateLimit(makeRequest(ip), maxRequests, windowMs, prefix);
    const blocked = await rateLimit(makeRequest(ip), maxRequests, windowMs, prefix);
    expect(blocked.allowed).toBe(false);

    // Advance past the window
    jest.advanceTimersByTime(windowMs + 1);

    const reset = await rateLimit(makeRequest(ip), maxRequests, windowMs, prefix);
    expect(reset.allowed).toBe(true);
    expect(reset.remaining).toBe(maxRequests - 1);

    jest.useRealTimers();
  });
});

describe('parseJsonBody', () => {
  it('parses valid JSON payloads', async () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({ ok: true }),
      headers: { 'content-type': 'application/json' },
    });
    const result = await parseJsonBody<{ ok: boolean }>(request);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ ok: true });
  });

  it('rejects invalid JSON payloads', async () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      body: '{',
      headers: { 'content-type': 'application/json' },
    });
    const result = await parseJsonBody(request);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid request body/i);
  });

  it('rejects payloads above the max size', async () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({ value: 'x'.repeat(1024) }),
      headers: { 'content-type': 'application/json' },
    });
    const result = await parseJsonBody(request, 64);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/too large/i);
  });
});

describe('getSecurityHeaders', () => {
  it('includes nonce in script directives when provided', () => {
    const headers = getSecurityHeaders({ nonce: 'testnonce' });
    expect(headers['Content-Security-Policy']).toContain("'nonce-testnonce'");
    expect(headers['Strict-Transport-Security']).toContain('max-age=');
  });

  it('duplicates policy to Report-Only when CSP_REPORT_ONLY is set', () => {
    process.env.CSP_REPORT_ONLY = '1';
    const headers = getSecurityHeaders({ nonce: 'n' });
    expect(headers['Content-Security-Policy-Report-Only']).toBe(headers['Content-Security-Policy']);
    delete process.env.CSP_REPORT_ONLY;
  });

  it('passes drift assertion for generated security headers', () => {
    const headers = getSecurityHeaders({ nonce: 'testnonce' });
    expect(() => assertSecurityHeadersHaveRequiredDirectives(headers)).not.toThrow();
  });

  it('fails drift assertion when required directives are missing', () => {
    const headers = getSecurityHeaders({ nonce: 'testnonce' });
    const driftedHeaders = {
      ...headers,
      'X-Frame-Options': '',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'",
    };

    expect(() => assertSecurityHeadersHaveRequiredDirectives(driftedHeaders)).toThrow(
      /security drift detected/i
    );
  });
});

describe('getSecurityHeaders environment policy', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  function setNodeEnv(value: string | undefined): void {
    const env = process.env as Record<string, string | undefined>;
    if (value === undefined) {
      delete env.NODE_ENV;
    } else {
      env.NODE_ENV = value;
    }
  }

  afterEach(() => {
    setNodeEnv(originalNodeEnv);
  });

  it('serves the strict policy in production: no unsafe-eval, upgrades insecure requests', () => {
    setNodeEnv('production');
    const csp = getSecurityHeaders({ nonce: 'testnonce' })['Content-Security-Policy'];
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('allows unsafe-eval in development for HMR', () => {
    setNodeEnv('development');
    const csp = getSecurityHeaders({ nonce: 'testnonce' })['Content-Security-Policy'];
    expect(csp).toContain("'unsafe-eval'");
  });

  it('fails closed to the strict policy when NODE_ENV is unset', () => {
    setNodeEnv(undefined);
    const csp = getSecurityHeaders({ nonce: 'testnonce' })['Content-Security-Policy'];
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('drift check rejects the development policy when production policy is expected', () => {
    setNodeEnv('development');
    const devHeaders = getSecurityHeaders({ nonce: 'testnonce' });
    const issues = getSecurityHeaderDriftIssues(devHeaders, { expectProductionPolicy: true });

    expect(issues.some((issue) => issue.includes("'unsafe-eval'"))).toBe(true);
    expect(issues.some((issue) => issue.includes('upgrade-insecure-requests'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// rateLimitCleanupTimer
// ---------------------------------------------------------------------------

describe('rateLimitCleanupTimer', () => {
  it('registers the cleanup timer as a singleton on globalThis', () => {
    const timer = (globalThis as Record<string, unknown>)['__personalSiteRateLimitCleanup__'];
    expect(timer).toBeDefined();
  });
});
