'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setValidationError('Enter your email address.');
      setStatus('idle');
      return;
    }

    setValidationError(null);
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  const statusMessageId = 'subscribe-status-message';
  const errorMessageId = 'subscribe-error-message';
  const helperMessageId = 'subscribe-helper-message';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-3">
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        placeholder="Your email"
        autoComplete="email"
        value={email}
        aria-invalid={status === 'error' || Boolean(validationError)}
        aria-describedby={`${helperMessageId}${status !== 'idle' ? ` ${statusMessageId}` : ''}${validationError || status === 'error' ? ` ${errorMessageId}` : ''}`}
        onChange={(e) => {
          setEmail(e.target.value);
          if (validationError) setValidationError(null);
          if (status !== 'idle') setStatus('idle');
        }}
        className="a11y-focus-ring w-full rounded border-2 border-[var(--surface-border)] bg-[var(--input-bg)] p-3 text-[var(--input-fg)] placeholder:text-[var(--input-placeholder)] shadow-sm transition focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="a11y-focus-ring w-full rounded bg-[var(--accent)] px-4 py-2 font-medium text-[var(--on-accent)] shadow-sm transition disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      <p id={helperMessageId} className="text-xs text-center text-[var(--text-secondary)]">
        No spam, unsubscribe anytime.
      </p>
      <p id={statusMessageId} aria-live="polite" className="sr-only">
        {status === 'loading' ? 'Submitting your subscription request.' : ''}
        {status === 'success' ? 'Subscription successful. Check your inbox for confirmation.' : ''}
      </p>
      {status === 'success' && (
        <p className="text-center font-medium text-[var(--status-success)]">
          Check your inbox for confirmation! 🎉
        </p>
      )}
      {(validationError || status === 'error') && (
        <p id={errorMessageId} role="alert" className="text-center font-medium text-[var(--status-error)]">
          {validationError ?? 'Something went wrong. Try again.'}
        </p>
      )}
    </form>
  );
}
