import { NextRequest, NextResponse } from 'next/server';

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

const rateLimitStore = new Map<string, RateLimitBucket>();

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (bucket.expires <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

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
export function rateLimit(
  request: NextRequest | Request,
  maxRequests: number = SECURITY_CONSTANTS.RATE_LIMIT_DEFAULT,
  windowMs: number = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS,
  keyPrefix: string = 'default'
): { allowed: boolean; resetTime: number; remaining: number } {
  const clientIP = getClientIP(request);
  const key = `${keyPrefix}:${clientIP}`;
  const now = Date.now();

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

/**
 * Security headers configuration with production canvas support
 * Optimized for Vercel deployment environment
 */
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  // Detect if we're in Vercel production environment
  const isVercelProduction = process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';
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

    // Remove server information
    'X-Powered-By': '',

    // Enhanced permissions policy for canvas operations
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'magnetometer=()',
      'gyroscope=()',
      'speaker=()',
      'vibrate=()',
      'fullscreen=(self)',
      'payment=(self)',
      'accelerometer=()', // For smooth animations
      'ambient-light-sensor=()', // Prevent sensor access
      'autoplay=()', // Control autoplay
    ].join(', '),
  };

  // Content Security Policy with environment-specific optimizations
  const cspDirectives = [
    "default-src 'self'",

    // Script sources - more permissive in development, strict in production
    nonce
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''}`
      : `script-src 'self'${isDevelopment ? " 'unsafe-eval'" : ''}${isVercelProduction ? " 'wasm-unsafe-eval'" : ''}`,

    // Style sources - optimized for canvas animations and Next.js requirements
    `style-src 'self' 'unsafe-inline'${isVercelProduction ? ' data:' : ''}`,

    // Image sources - comprehensive coverage for canvas operations
    "img-src 'self' data: blob: https:",

    // Font sources with CDN support
    "font-src 'self' data: https:",

    // Connection sources for API calls
    "connect-src 'self' https://api.coingecko.com https:",

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

    // Upgrade insecure requests in production
    ...(isVercelProduction ? ['upgrade-insecure-requests'] : []),
  ];

  headers['Content-Security-Policy'] = cspDirectives.join('; ');

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
  const timestamp = new Date().toISOString();
  console.warn(`SECURITY EVENT [${timestamp}] ${event}:`, details);
}
