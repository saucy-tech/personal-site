'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactConfetti from 'react-confetti';
import QRCode from 'react-qr-code';

type TipJarState = 'select' | 'pay' | 'success';
type AmountOption = 21 | 404 | 1000 | 20000 | 'custom';

export default function TipJar() {
  const [state, setState] = useState<TipJarState>('select');
  const [selectedAmount, setSelectedAmount] = useState<AmountOption>(21);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 800 });
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // update window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
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
      const response = await axios.post('/api/invoice', {
        amount,
        memo: message || 'Lightning Tip Jar',
      });
      setInvoice(response.data.paymentRequest);
      setState('pay');
      startPolling(response.data.paymentHash);
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
        const response = await axios.get(`/api/invoice?paymentHash=${hash}`);
        if (response.data.paid) {
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
    setSelectedAmount(21);
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
          colors={['#D4AF37', '#8b5cf6', '#ec4899', '#10b981']}
        />
      )}

      <div className="border border-[var(--accent-border)] rounded-lg p-6">
        {state === 'select' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Select Amount (sats)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[21, 404, 1000, 20000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount as AmountOption)}
                    className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                      selectedAmount === amount
                        ? 'bg-[var(--accent)] text-[var(--background)]'
                        : 'bg-[var(--accent-transparent)] text-[var(--text-primary)] hover:bg-[var(--accent-hover)]'
                    }`}
                  >
                    {amount} sats
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Custom Amount (sats)
              </label>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter sats"
                className="w-full border border-[var(--accent-border)] p-2 rounded-md bg-transparent text-[var(--text-primary)]"
              />
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
              className="w-full py-2 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--background)] disabled:opacity-50"
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
              className="mt-4 py-2 px-4 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--background)]"
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
              className="mt-2 py-2 px-4 rounded-md transition-colors duration-200 bg-[var(--accent)] text-[var(--background)]"
            >
              Send another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
