import { NextRequest, NextResponse } from 'next/server';

import { getSiteUrl } from '@/utils/constants';
import { logStructured } from '@/utils/logger';

// Security constants
export const SECURITY_CONSTANTS = {
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 60_000, // 1 minute
  RATE_LIMIT_DEFAULT: 100, // requests per window
  RATE_LIMIT_API: 60, // requests per window for API routes
  RATE_LIMIT_INVOICE: 10, // requests per window for invoice creation
  RATE_LIMIT_SUBSCRIBE: 5, // requests per window for subscription

  // Request limits
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  REQUEST_TIMEOUT: 30000, // 30 seconds

  // Input validation
  MAX_MEMO_LENGTH: 500,
  MAX_COMMENT_LENGTH: 280,
  MIN_AMOUNT_SATS: 1,
  MAX_AMOUNT_SATS: 1000000, // 1M sats = 0.01 BTC

  // Security headers
  CSP_NONCE_LENGTH: 16,
} as const;

// In-memory rate limiter (per edge/server instance)
interface RateLimitBucket {
  count: number;
  expires: number;
}

/**
 * Per-isolate fallback bucket.
 *
 * This is NOT a rate limit on Cloudflare Workers and must never be the only
 * thing standing in front of a paid API. Every colo runs its own isolates, each
 * with its own empty Map, so a caller exceeds any limit enforced here by
 * however many isolates it reaches. It survives only as the last resort when
 * the KV binding is missing — a local `next dev` without wrangler, or a
 * misconfigured deploy — and it says so loudly when it engages.
 */
const rateLimitStore = new Map<string, RateLimitBucket>();
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Clean up expired rate limit entries periodically.
// Keep the timer unref'd and singleton-guarded so test imports do not pin the process open.
const rateLimitCleanupKey = '__personalSiteRateLimitCleanup__';

function startRateLimitCleanupTimer() {
  const globalScope = globalThis as typeof globalThis & {
    [rateLimitCleanupKey]?: ReturnType<typeof setInterval>;
  };

  if (globalScope[rateLimitCleanupKey]) {
    return;
  }

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitStore.entries()) {
      if (bucket.expires <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);

  cleanupTimer.unref?.();
  globalScope[rateLimitCleanupKey] = cleanupTimer;
}

startRateLimitCleanupTimer();

/**
 * Generate a cryptographically secure nonce for CSP
 * Uses Web Crypto API for Edge Runtime compatibility
 */
export function generateCSPNonce(): string {
  // Use Web Crypto API which is available in both Node.js and Edge Runtime
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Edge Runtime / Browser environment
    const array = new Uint8Array(SECURITY_CONSTANTS.CSP_NONCE_LENGTH);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  } else if (
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    globalThis.crypto.getRandomValues
  ) {
    // Node.js 19+ with global crypto
    const array = new Uint8Array(SECURITY_CONSTANTS.CSP_NONCE_LENGTH);
    globalThis.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  } else {
    // Fallback for older environments (shouldn't happen in modern setups)
    console.warn('Web Crypto API not available, using Math.random() fallback');
    return btoa(Math.random().toString(36).substring(2, 18));
  }
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: NextRequest | Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  // Try different header sources in order of preference
  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';

  return 'unknown';
}

/**
 * Rate limiter with configurable limits per endpoint
 */
async function rateLimitWithUpstash(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; resetTime: number; remaining: number } | null> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  try {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, windowMs, 'NX'],
        ['PTTL', key],
      ]),
    });

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as Array<{ result?: number | string }>;
    const count = Number(result?.[0]?.result ?? 0);
    const ttlMs = Number(result?.[2]?.result ?? windowMs);
    const now = Date.now();
    const resetTime = now + (ttlMs > 0 ? ttlMs : windowMs);
    const remaining = Math.max(0, maxRequests - count);

    return {
      allowed: count <= maxRequests,
      resetTime,
      remaining,
    };
  } catch {
    return null;
  }
}

/**
 * Cloudflare's rate-limiting binding: one atomic counter per key, evaluated in
 * the runtime rather than in application code.
 *
 * This replaced a KV-backed counter, which could not do this job. KV has no
 * atomic increment and accepts only one write per second to a given key, so a
 * read-modify-write counter either denied legitimate callers (when a throttled
 * write was treated as failure) or let a burst through (when it was not): at
 * 100 req/s a "5 per minute" limit passed roughly 400 requests before the
 * count caught up. Neither is a rate limit.
 *
 * The trade this makes instead is scope: the binding counts per Cloudflare
 * location, not globally, so a caller spread across many locations gets that
 * many allowances. That is a real limit with a known boundary, which beats an
 * approximate global one that does not bind. If a global count is ever needed,
 * a Durable Object is the primitive — with the caveat that exporting one from
 * an OpenNext build is not a config-only change, which this is.
 */
interface RateLimiterBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

// Each tier is its own binding because the allowance lives in wrangler.jsonc
// rather than in the call. Keyed by the constant so that changing a limit here
// without changing it there is a visible mismatch rather than a silent one.
const RATE_LIMITER_BINDINGS: Record<number, string> = {
  [SECURITY_CONSTANTS.RATE_LIMIT_SUBSCRIBE]: 'RATE_LIMITER_SUBSCRIBE',
  [SECURITY_CONSTANTS.RATE_LIMIT_INVOICE]: 'RATE_LIMITER_INVOICE',
  [SECURITY_CONSTANTS.RATE_LIMIT_API]: 'RATE_LIMITER_API',
};

async function rateLimitWithBinding(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; resetTime: number; remaining: number } | null> {
  const bindingName = RATE_LIMITER_BINDINGS[maxRequests];
  if (!bindingName) return null;

  let limiter: RateLimiterBinding | undefined;
  try {
    // Imported lazily and deliberately: outside a Workers runtime this module
    // is not loadable, and "not loadable" is exactly the signal that there is
    // no binding to reach. Keeps the ESM-only package out of the Jest graph.
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    limiter = (env as unknown as Record<string, RateLimiterBinding | undefined>)[bindingName];
  } catch {
    // Not running on Workers at all (a plain `next dev`, or a unit test).
    return null;
  }
  if (!limiter) return null;

  // The binding does not report a window position, so Retry-After is the
  // conservative whole window rather than the true remaining time.
  const resetTime = Date.now() + windowMs;

  try {
    const { success } = await limiter.limit({ key });
    return { allowed: success, resetTime, remaining: success ? maxRequests - 1 : 0 };
  } catch (error) {
    logStructured('error', 'rate_limit_backend_error', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    // Deny. A limiter that cannot count must not wave traffic through.
    return { allowed: false, resetTime, remaining: 0 };
  }
}

export async function rateLimit(
  request: NextRequest | Request,
  maxRequests: number = SECURITY_CONSTANTS.RATE_LIMIT_DEFAULT,
  windowMs: number = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
  keyPrefix: string = 'default'
): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
  const clientIP = getClientIP(request);
  const key = `${keyPrefix}:${clientIP}`;
  const now = Date.now();

  // Upstash first only because it is already wired and exact when configured.
  const distributedResult = await rateLimitWithUpstash(key, maxRequests, windowMs);
  if (distributedResult) {
    return distributedResult;
  }

  const bindingResult = await rateLimitWithBinding(key, maxRequests, windowMs);
  if (bindingResult) {
    return bindingResult;
  }

  logStructured('warn', 'rate_limit_per_isolate_fallback', {
    key: keyPrefix,
    detail:
      'No rate-limiting binding and no Upstash config; this limit is per-isolate and does not bound a distributed caller.',
  });

  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.expires <= now) {
    // Create new bucket or reset expired one
    const newBucket = {
      count: 1,
      expires: now + windowMs,
    };
    rateLimitStore.set(key, newBucket);

    return {
      allowed: true,
      resetTime: newBucket.expires,
      remaining: maxRequests - 1,
    };
  }

  // Check if limit exceeded
  if (bucket.count >= maxRequests) {
    return {
      allowed: false,
      resetTime: bucket.expires,
      remaining: 0,
    };
  }

  // Increment count
  bucket.count += 1;

  return {
    allowed: true,
    resetTime: bucket.expires,
    remaining: maxRequests - bucket.count,
  };
}

/**
 * Input validation utilities
 */
export const validators = {
  /**
   * Validate and sanitize email address
   */
  email(email: unknown): { valid: boolean; sanitized?: string; error?: string } {
    if (typeof email !== 'string') {
      return { valid: false, error: 'Email must be a string' };
    }

    const sanitized = email.trim().toLowerCase();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(sanitized)) {
      return { valid: false, error: 'Invalid email format' };
    }

    if (sanitized.length > 254) {
      return { valid: false, error: 'Email too long' };
    }

    return { valid: true, sanitized };
  },

  /**
   * Validate Lightning Network payment amount
   */
  lightningAmount(
    amount: unknown,
    unit: 'sats' | 'msats' = 'sats'
  ): { valid: boolean; sanitized?: number; error?: string } {
    if (typeof amount !== 'number' && typeof amount !== 'string') {
      return { valid: false, error: 'Amount must be a number or string' };
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount) || !isFinite(numAmount)) {
      return { valid: false, error: 'Amount must be a valid number' };
    }

    if (!Number.isInteger(numAmount)) {
      return { valid: false, error: 'Amount must be a whole number of satoshis' };
    }

    if (numAmount <= 0) {
      return { valid: false, error: 'Amount must be positive' };
    }

    // Convert to sats for validation
    const satsAmount = unit === 'msats' ? numAmount / 1000 : numAmount;

    if (satsAmount < SECURITY_CONSTANTS.MIN_AMOUNT_SATS) {
      return {
        valid: false,
        error: `Amount too small (min: ${SECURITY_CONSTANTS.MIN_AMOUNT_SATS} sats)`,
      };
    }

    if (satsAmount > SECURITY_CONSTANTS.MAX_AMOUNT_SATS) {
      return {
        valid: false,
        error: `Amount too large (max: ${SECURITY_CONSTANTS.MAX_AMOUNT_SATS} sats)`,
      };
    }

    return { valid: true, sanitized: numAmount };
  },

  /**
   * Validate and sanitize text input (memo, comment)
   */
  text(
    text: unknown,
    maxLength: number = SECURITY_CONSTANTS.MAX_MEMO_LENGTH
  ): { valid: boolean; sanitized?: string; error?: string } {
    if (text === null || text === undefined || text === '') {
      return { valid: true, sanitized: '' };
    }

    if (typeof text !== 'string') {
      return { valid: false, error: 'Text must be a string' };
    }

    // Remove null bytes and control characters except newlines and tabs
    const sanitized = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

    if (sanitized.length > maxLength) {
      return { valid: false, error: `Text too long (max: ${maxLength} characters)` };
    }

    return { valid: true, sanitized };
  },

  /**
   * Validate Lightning Network payment hash
   */
  paymentHash(hash: unknown): { valid: boolean; sanitized?: string; error?: string } {
    if (typeof hash !== 'string') {
      return { valid: false, error: 'Payment hash must be a string' };
    }

    const sanitized = hash.trim().toLowerCase();

    // Payment hash should be 64 hex characters (32 bytes)
    if (!/^[0-9a-f]{64}$/.test(sanitized)) {
      return { valid: false, error: 'Invalid payment hash format' };
    }

    return { valid: true, sanitized };
  },
};

const REQUIRED_SECURITY_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
] as const;

const REQUIRED_CSP_SUBSTRINGS = [
  "default-src 'self'",
  "script-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
] as const;

// The CSP branches on environment (development allows 'unsafe-eval' for HMR).
// These pins define what the production branch must and must not serve, so the
// drift check fails if a deployed environment ever gets the development policy.
const PRODUCTION_REQUIRED_CSP_SUBSTRINGS = ['upgrade-insecure-requests'] as const;
const PRODUCTION_FORBIDDEN_CSP_SUBSTRINGS = ["'unsafe-eval'"] as const;

export function getSecurityHeaderDriftIssues(
  headers: Record<string, string>,
  options: { expectProductionPolicy?: boolean } = {}
): string[] {
  const issues: string[] = [];

  for (const headerName of REQUIRED_SECURITY_HEADERS) {
    if (!headers[headerName]) {
      issues.push(`Missing required header: ${headerName}`);
    }
  }

  const csp = headers['Content-Security-Policy'];
  if (!csp) {
    return issues;
  }

  for (const requiredPart of REQUIRED_CSP_SUBSTRINGS) {
    if (!csp.includes(requiredPart)) {
      issues.push(`CSP is missing required directive fragment: ${requiredPart}`);
    }
  }

  if (options.expectProductionPolicy) {
    for (const requiredPart of PRODUCTION_REQUIRED_CSP_SUBSTRINGS) {
      if (!csp.includes(requiredPart)) {
        issues.push(`Production CSP is missing required directive: ${requiredPart}`);
      }
    }

    for (const forbiddenPart of PRODUCTION_FORBIDDEN_CSP_SUBSTRINGS) {
      if (csp.includes(forbiddenPart)) {
        issues.push(`Production CSP must not include: ${forbiddenPart}`);
      }
    }
  }

  return issues;
}

export function assertSecurityHeadersHaveRequiredDirectives(headers: Record<string, string>): void {
  const issues = getSecurityHeaderDriftIssues(headers);
  if (issues.length > 0) {
    throw new Error(`Security drift detected:\n- ${issues.join('\n- ')}`);
  }
}

/**
 * Security headers configuration with production canvas support
 * Platform-neutral: behaves the same on Cloudflare Workers (OpenNext), Node, and `next dev`
 */
export function getSecurityHeaders(options: { nonce?: string } = {}): Record<string, string> {
  const { nonce } = options;
  // Loosen the CSP only for `next dev` (NODE_ENV=development), which needs
  // 'unsafe-eval' for HMR/React Refresh. Everything else - including unset or
  // unrecognized environments - fails closed to the strict production policy.
  // (Detection used to key on Vercel env vars, which never exist on Cloudflare
  // Workers, so production served the development policy after the migration.)
  const isDevelopment = process.env.NODE_ENV === 'development';
  const headers: Record<string, string> = {
    // Prevent DNS prefetching for privacy
    'X-DNS-Prefetch-Control': 'off',

    // Legacy XSS protection (disabled as it can cause vulnerabilities)
    'X-XSS-Protection': '0',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME sniffing
    'X-Content-Type-Options': 'nosniff',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Force HTTPS in modern browsers
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

    // Remove server information
    'X-Powered-By': '',

    // Minimal, widely-supported Permissions-Policy (avoid features browsers do not recognize)
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'fullscreen=(self)',
    ].join(', '),
  };

  // Content Security Policy with environment-specific optimizations
  const cspDirectives = [
    "default-src 'self'",

    // Script sources: 'unsafe-inline' is required for Next.js App Router chunks/scripts that
    // do not receive per-request nonces from middleware. Nonce remains for tagged inline scripts.
    // eval only in local development (HMR/React Refresh).
    isDevelopment
      ? `script-src 'self' 'unsafe-inline'${nonce ? ` 'nonce-${nonce}'` : ''} 'unsafe-eval' blob:`
      : `script-src 'self' 'unsafe-inline'${nonce ? ` 'nonce-${nonce}'` : ''} blob:`,
    // Element-specific sources to satisfy browsers that split elem vs attr policies
    `script-src-elem 'self' 'unsafe-inline'${nonce ? ` 'nonce-${nonce}'` : ''} blob:`,

    // Style sources - allow data: for any inlined style blocks if emitted
    "style-src 'self' 'unsafe-inline' data:",
    "style-src-elem 'self' 'unsafe-inline'",

    // Image sources - comprehensive coverage for canvas operations
    "img-src 'self' data: blob: https:",

    // Font sources with CDN support
    "font-src 'self' data: https:",

    // Connection sources for API calls
    "connect-src 'self' https://api.coingecko.com https: wss:",

    // Media sources for canvas-generated content
    "media-src 'self' data: blob:",

    // Security restrictions
    "object-src 'none'",
    "frame-src 'none'",

    // Worker sources - essential for canvas operations
    "worker-src 'self' blob: data:",

    // Child contexts for Web Workers and canvas
    "child-src 'self' blob: data:",

    // PWA and security directives
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",

    // Upgrade insecure requests everywhere except local development
    ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
  ];

  if (process.env.ENABLE_CSP_VIOLATION_REPORTS === '1') {
    try {
      const reportTo = new URL('/api/csp-report', getSiteUrl()).toString();
      cspDirectives.push(`report-uri ${reportTo}`);
    } catch {
      // ignore invalid SITE_URL at build time
    }
  }

  const cspValue = cspDirectives.join('; ');
  headers['Content-Security-Policy'] = cspValue;

  if (process.env.CSP_REPORT_ONLY === '1') {
    headers['Content-Security-Policy-Report-Only'] = cspValue;
  }

  return headers;
}

/**
 * Create a rate-limited response with proper headers
 */
export function createRateLimitResponse(resetTime: number): NextResponse {
  const response = NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
    },
    { status: 429 }
  );

  response.headers.set('Retry-After', Math.ceil((resetTime - Date.now()) / 1000).toString());
  response.headers.set('X-RateLimit-Limit', '60');
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

  return response;
}

/**
 * Create a secure error response that doesn't leak information
 */
export function createSecureErrorResponse(
  message: string = 'An error occurred',
  status: number = 500,
  logDetails?: string
): NextResponse {
  // Log detailed error for debugging (not exposed to client)
  if (logDetails) {
    console.error('Security Error:', logDetails);
  }

  return NextResponse.json({ error: message }, { status });
}

/**
 * Validate request size
 */
export async function validateRequestSize(
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  const contentLength = request.headers.get('content-length');

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > SECURITY_CONSTANTS.MAX_REQUEST_SIZE) {
      return {
        valid: false,
        error: `Request too large (max: ${SECURITY_CONSTANTS.MAX_REQUEST_SIZE} bytes)`,
      };
    }
  }

  return { valid: true };
}

/**
 * Parse JSON request body while enforcing a hard byte limit.
 * This protects routes even when Content-Length is missing or inaccurate.
 */
export async function parseJsonBody<T = unknown>(
  request: Request,
  maxSizeBytes: number = SECURITY_CONSTANTS.MAX_REQUEST_SIZE
): Promise<{ valid: boolean; data?: T; error?: string }> {
  const sizeValidation = await validateRequestSize(request);
  if (!sizeValidation.valid) {
    return { valid: false, error: sizeValidation.error };
  }

  const rawBody = await request.text();
  const bodySize = new TextEncoder().encode(rawBody).byteLength;
  if (bodySize > maxSizeBytes) {
    return {
      valid: false,
      error: `Request too large (max: ${maxSizeBytes} bytes)`,
    };
  }

  try {
    const data = JSON.parse(rawBody) as T;
    return { valid: true, data };
  } catch {
    return { valid: false, error: 'Invalid request body' };
  }
}

/**
 * Security logging utility
 */
export function logSecurityEvent(
  event: 'rate_limit_exceeded' | 'invalid_input' | 'suspicious_request' | 'auth_failure',
  details: {
    ip?: string;
    userAgent?: string;
    endpoint?: string;
    reason?: string;
  }
): void {
  logStructured('warn', `security_${event}`, details);
}
