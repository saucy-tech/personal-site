'use client';

import { useState } from 'react';
import { Check, Link, Mail, X as XIcon } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

export default function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const emailBody = excerpt ? `${title}\n\n${excerpt}\n\n${url}` : `${title}\n\n${url}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleNativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url, text: excerpt });
        return true;
      } catch {
        // User cancelled or share failed — fall through
      }
    }
    return false;
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Share</p>
      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
        Found this helpful? Pass it on.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {/* Native share (mobile) — shown only on supporting devices via JS, but we render a fallback set always */}
        <button
          onClick={handleNativeShare}
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-transparent)] hover:text-[var(--text-primary)] sm:hidden"
          aria-label="Share this post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-transparent)] hover:text-[var(--text-primary)] sm:flex"
          aria-label="Share on X (Twitter)"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />X / Twitter
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-transparent)] hover:text-[var(--text-primary)] sm:flex"
          aria-label="Share on Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* Email */}
        <a
          href={emailUrl}
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-transparent)] hover:text-[var(--text-primary)] sm:flex"
          aria-label="Share via email"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-transparent)] hover:text-[var(--text-primary)]"
          aria-label={copied ? 'Link copied!' : 'Copy link to clipboard'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
          ) : (
            <Link className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
