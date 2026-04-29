'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setValidationError('Enter your email address.');
      setStatus('idle');
      return;
    }

    setValidationError(null);
    setServerMessage(null);
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company: honeypot }),
      });
      let already = false;
      if (res.ok) {
        try {
          const data = (await res.json()) as { success?: boolean; alreadySubscribed?: boolean };
          already = Boolean(data.alreadySubscribed);
        } catch {
          // ignore
        }
      }
      if (res.ok) {
        setStatus('success');
        setEmail('');
        if (already) {
          setServerMessage("You're already on the list — no need to sign up again.");
        } else {
          setServerMessage(null);
        }
      } else {
        let message: string | null = null;
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) {
            message = data.error;
          }
        } catch {
          // ignore
        }
        setServerMessage(message);
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const statusMessageId = 'subscribe-status-message';
  const errorMessageId = 'subscribe-error-message';
  const helperMessageId = 'subscribe-helper-message';

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto space-y-3">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
      />
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
        className="a11y-focus-ring w-full rounded-sm border-2 border-(--surface-border) bg-(--input-bg) p-3 text-(--input-fg) placeholder:text-(--input-placeholder) shadow-xs transition focus:border-(--accent)"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="a11y-focus-ring w-full rounded-sm bg-(--accent) px-4 py-2 font-medium text-(--on-accent) shadow-xs transition disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      <p id={helperMessageId} className="text-xs text-center text-(--text-secondary)">
        No spam, unsubscribe anytime.
      </p>
      <p id={statusMessageId} aria-live="polite" className="sr-only">
        {status === 'loading' ? 'Submitting your subscription request.' : ''}
        {status === 'success' ? 'Subscription successful. Check your inbox for confirmation.' : ''}
      </p>
      {status === 'success' && (
        <p className="text-center font-medium text-(--status-success)">
          {serverMessage ?? 'Check your inbox for confirmation! 🎉'}
        </p>
      )}
      {(validationError || status === 'error') && (
        <p
          id={errorMessageId}
          role="alert"
          className="text-center font-medium text-(--status-error)"
        >
          {validationError ?? serverMessage ?? 'Something went wrong. Try again.'}
        </p>
      )}
    </form>
  );
}
