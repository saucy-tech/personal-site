'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border-2 border-[var(--surface-border)] bg-[var(--input-bg)] p-3 text-[var(--input-fg)] placeholder:text-[var(--input-placeholder)] shadow-sm transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded bg-[var(--accent)] px-4 py-2 font-medium text-[var(--on-accent)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      <p className="text-xs text-center text-[var(--text-secondary)]">
        No spam, unsubscribe anytime.
      </p>
      {status === 'success' && (
        <p className="text-center font-medium text-[var(--status-success)]">
          Check your inbox for confirmation! 🎉
        </p>
      )}
      {status === 'error' && (
        <p className="text-center font-medium text-[var(--status-error)]">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
