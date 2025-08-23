// LNURL-p configuration
export const LNURL_CONFIG = {
  minSendable: parseInt(process.env.LNURL_MIN_SENDABLE || '1000'), // msats
  maxSendable: parseInt(process.env.LNURL_MAX_SENDABLE || '1000000000'), // msats
  commentAllowed: parseInt(process.env.LNURL_COMMENT_ALLOWED || '280'), // characters
  tag: 'payRequest',
  metadata: JSON.stringify([
    ['text/plain', process.env.LNURL_METADATA_TEXT || 'Tip to brandon'],
    ['text/long-desc', process.env.LNURL_METADATA_DESC || 'Lightning tip jar for brandon'],
  ]),
} as const;

// Validation function
export function validateLnurlAmount(amountMsats: number): { valid: boolean; error?: string } {
  if (isNaN(amountMsats) || amountMsats <= 0) {
    return { valid: false, error: 'Invalid amount.' };
  }

  if (amountMsats < LNURL_CONFIG.minSendable || amountMsats > LNURL_CONFIG.maxSendable) {
    return {
      valid: false,
      error: `Amount must be between ${LNURL_CONFIG.minSendable} and ${LNURL_CONFIG.maxSendable} msats.`,
    };
  }

  return { valid: true };
}
