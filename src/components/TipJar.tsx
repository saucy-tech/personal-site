'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useId, useRef } from 'react';

import { PRESET_AMOUNTS } from '@/utils/tipjar';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });
const QRCode = dynamic(() => import('react-qr-code').then((mod) => mod.QRCode), { ssr: false });

type TipJarState = 'select' | 'pay' | 'success';
type AmountOption = (typeof PRESET_AMOUNTS)[number] | 'custom';

interface TipJarProps {
  initialMemo?: string;
}

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 800, height: 800 };
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

export default function TipJar({ initialMemo }: TipJarProps) {
  const [state, setState] = useState<TipJarState>('select');
  const [selectedAmount, setSelectedAmount] = useState<AmountOption>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState(() => initialMemo ?? '');
  const [invoice, setInvoice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(getViewportSize);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [confettiAccent, setConfettiAccent] = useState('#f7931a');
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);
  const maxPollAttempts = 80;
  const amountLabelId = useId();
  const customAmountId = useId();
  const messageId = useId();

  const stopPolling = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = null;
  };

  useEffect(() => {
    const syncAccent = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (raw) setConfettiAccent(raw);
    };
    syncAccent();
    const obs = new MutationObserver(syncAccent);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-appearance'],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
        }
      };
    }

    const handleResize = () => setWindowSize(getViewportSize());

    window.addEventListener('resize', handleResize);

    // Cleanup function for timers and listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('/api/btcusd');
        if (!res.ok) throw new Error('Failed to fetch rate');
        const data = await res.json();
        setUsdRate(data.usd);
      } catch (err) {
        console.error('Error fetching BTC/USD rate:', err);
      }
    };
    fetchRate();
  }, []);

  const handleAmountSelect = (amount: AmountOption) => {
    setSelectedAmount(amount);
    if (amount !== 'custom') setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const getAmount = () => {
    if (selectedAmount === 'custom') {
      return customAmount ? parseInt(customAmount, 10) : 0;
    }
    return selectedAmount;
  };

  const generateInvoice = async () => {
    try {
      setError('');
      setIsGeneratingInvoice(true);
      const amount = getAmount();
      if (amount <= 0) {
        setError('Please enter a valid amount');
        setIsGeneratingInvoice(false);
        return;
      }
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, memo: message || 'Lightning Tip Jar' }),
      });
      if (!res.ok) {
        throw new Error('Failed to create invoice');
      }
      const data = await res.json();
      setInvoice(data.paymentRequest);
      setState('pay');
      startPolling(data.paymentHash);
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError(
        "Sorry, we couldn't connect to the Lightning Network at this time. Please try again later."
      );
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const startPolling = (hash: string) => {
    stopPolling();
    pollAttemptsRef.current = 0;
    const baseMs = 3000;
    const timer = setInterval(async () => {
      pollAttemptsRef.current += 1;
      if (pollAttemptsRef.current > maxPollAttempts) {
        stopPolling();
        setError('Still waiting on the network—check your wallet or try again in a moment.');
        return;
      }
      try {
        const res = await fetch(`/api/invoice?paymentHash=${hash}`);
        if (!res.ok) return; // continue polling silently
        const data = await res.json();
        // Polling was stopped or replaced (Change amount, a new invoice, reset) while this
        // request or its body was in flight; its result no longer applies.
        if (pollTimerRef.current !== timer) return;
        if (data.paid) {
          stopPolling();
          setState('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    }, baseMs);
    pollTimerRef.current = timer;
  };

  // Back from the invoice to amount selection, keeping the chosen amount and message.
  const changeAmount = () => {
    stopPolling();
    setState('select');
    setInvoice('');
    setError('');
    setCopyButtonText('Copy');
  };

  const resetForm = () => {
    setState('select');
    setSelectedAmount(PRESET_AMOUNTS[0]);
    setCustomAmount('');
    setMessage('');
    setInvoice('');
    setError('');
    setShowConfetti(false);
    setCopyButtonText('Copy');
    stopPolling();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyButtonText('Error');
      setTimeout(() => setCopyButtonText('Copy'), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={[confettiAccent, '#8b5cf6', '#ec4899', '#10b981']}
        />
      )}

      <div className="border border-(--accent-border) rounded-lg p-6">
        {state === 'select' && (
          <div className="space-y-6">
            <div>
              <p
                id={amountLabelId}
                className="block text-sm font-medium mb-1 text-(--text-primary)"
              >
                Select amount (sats)
              </p>
              <div>
                <div
                  className="grid grid-cols-2 gap-3"
                  role="radiogroup"
                  aria-labelledby={amountLabelId}
                >
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      role="radio"
                      aria-checked={selectedAmount === amount}
                      onClick={() => handleAmountSelect(amount as AmountOption)}
                      className={`a11y-focus-ring py-2 px-4 rounded-md transition-colors duration-200 ${
                        selectedAmount === amount
                          ? 'bg-(--accent) text-(--on-accent)'
                          : 'bg-(--accent-transparent) text-(--text-primary) hover:bg-(--accent-hover)'
                      }`}
                    >
                      {amount} sats
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleAmountSelect('custom')}
                    className={`a11y-focus-ring px-3 py-1 rounded-md text-sm border border-(--accent-border) transition-colors duration-200 ${
                      selectedAmount === 'custom'
                        ? 'bg-(--accent) text-(--on-accent) border-(--accent)'
                        : 'bg-(--accent-transparent) text-(--text-primary) hover:bg-(--accent-hover)'
                    }`}
                  >
                    Custom
                  </button>
                  {selectedAmount === 'custom' && (
                    <>
                      <label htmlFor={customAmountId} className="sr-only">
                        Custom amount (sats)
                      </label>
                      <input
                        id={customAmountId}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter sats"
                        className="a11y-focus-ring w-40 border border-(--accent-border) p-2 rounded-md bg-transparent text-(--text-primary)"
                      />
                    </>
                  )}
                </div>
                {selectedAmount !== 'custom' && usdRate !== null && getAmount() > 0 && (
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    ≈ ${((getAmount() / 1e8) * usdRate).toFixed(2)} USD
                  </p>
                )}
                {selectedAmount === 'custom' && usdRate !== null && getAmount() > 0 && (
                  <p className="mt-2 text-sm text-(--text-secondary)">
                    ≈ ${((getAmount() / 1e8) * usdRate).toFixed(2)} USD
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={messageId}
                className="block text-sm font-medium mb-2 text-(--text-primary)"
              >
                Message (optional)
              </label>
              <textarea
                id={messageId}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Add a note"
                className="a11y-focus-ring w-full border border-(--accent-border) p-2 rounded-md bg-transparent text-(--text-primary)"
              />
            </div>

            <button
              type="button"
              onClick={generateInvoice}
              disabled={isGeneratingInvoice}
              className="a11y-focus-ring w-full py-2 rounded-md transition-colors duration-200 bg-(--accent) text-(--on-accent) disabled:opacity-50"
            >
              {isGeneratingInvoice ? 'Generating...' : 'Tip me'}
            </button>
          </div>
        )}

        {state === 'pay' && (
          <div className="text-center space-y-4">
            <div className="mb-4 flex justify-center">
              {/* White quiet zone keeps the code scannable on dark and tinted backgrounds */}
              <div className="rounded-md bg-white p-3">
                <QRCode value={invoice} size={200} />
              </div>
            </div>
            {!error && (
              <p role="status" className="text-sm text-(--text-secondary)">
                Waiting for payment…
              </p>
            )}
            <code className="block text-sm wrap-break-word bg-(--surface) border border-(--surface-border) p-3 rounded-sm text-(--text-primary)">
              {invoice}
            </code>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={copyToClipboard}
                className="a11y-focus-ring py-2 px-4 rounded-md transition-colors duration-200 bg-(--accent) text-(--on-accent)"
              >
                {copyButtonText}
              </button>
              <button
                type="button"
                onClick={changeAmount}
                className="a11y-focus-ring py-2 px-4 rounded-md border border-(--accent-border) text-(--text-primary) transition-colors duration-200 hover:bg-(--accent-hover)"
              >
                Change amount
              </button>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center space-y-4">
            <p className="text-(--accent) text-lg font-semibold">Thank you for your tip!</p>
            <button
              type="button"
              onClick={resetForm}
              className="a11y-focus-ring mt-2 py-2 px-4 rounded-md transition-colors duration-200 bg-(--accent) text-(--on-accent)"
            >
              Send another
            </button>
          </div>
        )}

        {/* Shared by select (invoice request failed) and pay (polling timed out) */}
        {error && state !== 'success' && (
          <p
            role="alert"
            className={`mt-4 text-sm text-(--status-error) ${state === 'pay' ? 'text-center' : ''}`}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
