'use client';

import { useState, useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import QRCode from 'react-qr-code';
import { PRESET_AMOUNTS } from '@/utils/tipjar';

type TipJarState = 'select' | 'pay' | 'success';
type AmountOption = (typeof PRESET_AMOUNTS)[number] | 'custom';

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 800, height: 800 };
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

export default function TipJar() {
  const [state, setState] = useState<TipJarState>('select');
  const [selectedAmount, setSelectedAmount] = useState<AmountOption>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(getViewportSize);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [confettiAccent, setConfettiAccent] = useState('#f7931a');
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/invoice?paymentHash=${hash}`);
        if (!res.ok) return; // continue polling silently
        const data = await res.json();
        if (data.paid) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setState('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    }, 3000);
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
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
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

      <div className="border border-[var(--accent-border)] rounded-lg p-6">
        {state === 'select' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Select Amount (sats)
              </label>
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount as AmountOption)}
                      className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                        selectedAmount === amount
                          ? 'bg-[var(--accent)] text-[var(--on-accent)]'
                          : 'bg-[var(--accent-transparent)] text-[var(--text-primary)] hover:bg-[var(--accent-hover)]'
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
                    className={`px-3 py-1 rounded-md text-sm border border-[var(--accent-border)] transition-colors duration-200 ${
                      selectedAmount === 'custom'
                        ? 'bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)]'
                        : 'bg-[var(--accent-transparent)] text-[var(--text-primary)] hover:bg-[var(--accent-hover)]'
                    }`}
                  >
                    Custom
                  </button>
                  {selectedAmount === 'custom' && (
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter sats"
                      className="w-40 border border-[var(--accent-border)] p-2 rounded-md bg-transparent text-[var(--text-primary)]"
                    />
                  )}
                </div>
                {selectedAmount !== 'custom' && usdRate !== null && getAmount() > 0 && (
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    ≈ ${((getAmount() / 1e8) * usdRate).toFixed(2)} USD
                  </p>
                )}
                {selectedAmount === 'custom' && usdRate !== null && getAmount() > 0 && (
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    ≈ ${((getAmount() / 1e8) * usdRate).toFixed(2)} USD
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Add a note"
                className="w-full border border-[var(--accent-border)] p-2 rounded-md bg-transparent text-[var(--text-primary)]"
              />
            </div>

            <button
              onClick={generateInvoice}
              disabled={isGeneratingInvoice}
              className="w-full py-2 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--on-accent)] disabled:opacity-50"
            >
              {isGeneratingInvoice ? 'Generating...' : 'Tip me'}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}

        {state === 'pay' && (
          <div className="text-center space-y-4">
            <div className="mb-4 flex justify-center">
              <QRCode value={invoice} size={200} />
            </div>
            <code className="block text-sm break-words bg-black/40 p-3 rounded text-[var(--text-primary)]">
              {invoice}
            </code>
            <button
              onClick={copyToClipboard}
              className="mt-4 py-2 px-4 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--on-accent)]"
            >
              {copyButtonText}
            </button>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center space-y-4">
            <p className="text-[var(--accent)] text-lg font-semibold">Thank you for your tip!</p>
            <button
              onClick={resetForm}
              className="mt-2 py-2 px-4 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--on-accent)]"
            >
              Send another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
