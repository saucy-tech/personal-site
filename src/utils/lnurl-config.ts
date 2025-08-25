import { SECURITY_CONSTANTS } from './security';

// LNURL-p configuration with security enhancements
export const LNURL_CONFIG = {
  minSendable: Math.max(
    parseInt(process.env.LNURL_MIN_SENDABLE || '1000'),
    SECURITY_CONSTANTS.MIN_AMOUNT_SATS * 1000
  ), // msats
  maxSendable: Math.min(
    parseInt(process.env.LNURL_MAX_SENDABLE || '1000000000'),
    SECURITY_CONSTANTS.MAX_AMOUNT_SATS * 1000
  ), // msats
  commentAllowed: Math.min(
    parseInt(process.env.LNURL_COMMENT_ALLOWED || '280'),
    SECURITY_CONSTANTS.MAX_COMMENT_LENGTH
  ), // characters
  tag: 'payRequest',
  metadata: JSON.stringify([
    ['text/plain', process.env.LNURL_METADATA_TEXT || 'Tip to brandon'],
    ['text/long-desc', process.env.LNURL_METADATA_DESC || 'Lightning tip jar for brandon'],
  ]),
  // Security settings
  maxRetries: 3,
  requestTimeout: 30000, // 30 seconds
} as const;

// Enhanced validation function with security checks
export function validateLnurlAmount(amountMsats: number): { valid: boolean; error?: string } {
  // Basic type and value validation
  if (!Number.isInteger(amountMsats) || amountMsats <= 0) {
    return { valid: false, error: 'Amount must be a positive integer.' };
  }

  // Check for unreasonably large numbers (potential DoS)
  if (amountMsats > Number.MAX_SAFE_INTEGER) {
    return { valid: false, error: 'Amount too large.' };
  }

  // Range validation
  if (amountMsats < LNURL_CONFIG.minSendable || amountMsats > LNURL_CONFIG.maxSendable) {
    return {
      valid: false,
      error: `Amount must be between ${LNURL_CONFIG.minSendable} and ${LNURL_CONFIG.maxSendable} msats.`,
    };
  }

  return { valid: true };
}

// Validate LNURL comment with security measures
export function validateLnurlComment(comment: string | null | undefined): {
  valid: boolean;
  sanitized?: string;
  error?: string;
} {
  if (!comment) {
    return { valid: true, sanitized: '' };
  }

  if (typeof comment !== 'string') {
    return { valid: false, error: 'Comment must be a string.' };
  }

  // Remove null bytes and control characters except newlines and tabs
  const sanitized = comment.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  if (sanitized.length > LNURL_CONFIG.commentAllowed) {
    return {
      valid: false,
      error: `Comment too long (max: ${LNURL_CONFIG.commentAllowed} characters).`,
    };
  }

  // Check for suspicious patterns (basic XSS prevention)
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, error: 'Comment contains suspicious content.' };
    }
  }

  return { valid: true, sanitized };
}

// Session tracking for payment security
const paymentSessions = new Map<
  string,
  {
    amount: number;
    timestamp: number;
    attempts: number;
    ip?: string;
  }
>();

// Clean up old sessions periodically
setInterval(
  () => {
    const now = Date.now();
    const maxAge = 1000 * 60 * 30; // 30 minutes

    for (const [key, session] of paymentSessions.entries()) {
      if (now - session.timestamp > maxAge) {
        paymentSessions.delete(key);
      }
    }
  },
  1000 * 60 * 5
); // Clean up every 5 minutes

// Track payment attempts for security monitoring
export function trackPaymentAttempt(paymentHash: string, amount: number, ip?: string): boolean {
  const session = paymentSessions.get(paymentHash);
  const now = Date.now();

  if (session) {
    // Check for suspicious rapid attempts
    if (now - session.timestamp < 1000) {
      // Less than 1 second
      return false; // Reject too rapid attempts
    }

    session.attempts += 1;
    session.timestamp = now;

    // Reject if too many attempts
    if (session.attempts > 10) {
      return false;
    }
  } else {
    paymentSessions.set(paymentHash, {
      amount,
      timestamp: now,
      attempts: 1,
      ip,
    });
  }

  return true;
}

// Get payment session info for monitoring
export function getPaymentSession(paymentHash: string) {
  return paymentSessions.get(paymentHash);
}
