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
      <input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded text-black"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[var(--accent)] px-4 py-2 rounded w-full disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      <p className="text-xs text-center text-[var(--text-secondary)]">
        No spam, unsubscribe anytime.
      </p>
      {status === 'success' && (
        <p className="text-green-400 text-center">Check your inbox for confirmation! 🎉</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-center">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
