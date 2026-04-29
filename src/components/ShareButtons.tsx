'use client';

import { useState } from 'react';
import {
  CheckIcon,
  EnvelopeIcon,
  LinkIcon,
  ShareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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

  async function handleMobileShare() {
    const shared = await handleNativeShare();
    if (!shared) {
      await handleCopy();
    }
  }

  return (
    <div className="rounded-4xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <p className="text-sm uppercase tracking-[0.18em] text-(--accent)">Share</p>
      <p className="mt-1 text-base font-semibold text-(--text-primary)">
        Found this helpful? Pass it on.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleMobileShare}
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--accent-border) hover:bg-(--accent-transparent) hover:text-(--text-primary) sm:hidden"
          aria-label="Share this post or copy the link"
        >
          <ShareIcon className="h-4 w-4" aria-hidden="true" />
          Share
        </button>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--accent-border) hover:bg-(--accent-transparent) hover:text-(--text-primary) sm:flex"
          aria-label="Share on X (Twitter)"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />X / Twitter
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--accent-border) hover:bg-(--accent-transparent) hover:text-(--text-primary) sm:flex"
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

        <a
          href={emailUrl}
          className="hidden min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--accent-border) hover:bg-(--accent-transparent) hover:text-(--text-primary) sm:flex"
          aria-label="Share via email"
        >
          <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
          Email
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--accent-border) hover:bg-(--accent-transparent) hover:text-(--text-primary)"
          aria-label={copied ? 'Link copied!' : 'Copy link to clipboard'}
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-400" aria-hidden="true" />
          ) : (
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
