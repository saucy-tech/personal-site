import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import TipJar from '@/components/TipJar';

// QRCode and confetti load through next/dynamic; they don't matter to these tests.
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function DynamicStub() {
      return null;
    },
}));

const POLL_MS = 3000;
const MAX_POLL_ATTEMPTS = 80;
const INVOICE = 'lnbc210n1testinvoice';

function mockFetch() {
  return jest.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    let body: unknown = {};
    if (url === '/api/btcusd') body = { usd: 100_000 };
    else if (url.includes('paymentHash=')) body = { paid: false };
    else if (url === '/api/invoice') body = { paymentRequest: INVOICE, paymentHash: 'hash123' };
    return { ok: true, json: async () => body } as Response;
  });
}

function pollCalls(fetchMock: jest.Mock) {
  return fetchMock.mock.calls.filter(([input]) => String(input).includes('paymentHash=')).length;
}

// Renders and lets the BTC/USD rate request settle inside act().
async function renderTipJar(props: React.ComponentProps<typeof TipJar> = {}) {
  render(<TipJar {...props} />);
  await act(async () => {
    await jest.advanceTimersByTimeAsync(0);
  });
}

async function openInvoice() {
  await renderTipJar();
  fireEvent.click(screen.getByRole('button', { name: 'Tip me' }));
  await screen.findByText(INVOICE);
}

describe('TipJar', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock = mockFetch();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = originalFetch;
  });

  it('shows the polling timeout error while the invoice is on screen', async () => {
    await openInvoice();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(POLL_MS * (MAX_POLL_ATTEMPTS + 1));
    });

    expect(screen.getByText(INVOICE)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Still waiting on the network');
  });

  it('stops polling and returns to amount selection on "Change amount"', async () => {
    await openInvoice();
    expect(screen.getByRole('status')).toHaveTextContent('Waiting for payment…');

    await act(async () => {
      await jest.advanceTimersByTimeAsync(POLL_MS * 2);
    });
    const callsBeforeBack = pollCalls(fetchMock);
    expect(callsBeforeBack).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Change amount' }));

    expect(screen.getByRole('button', { name: 'Tip me' })).toBeInTheDocument();
    expect(screen.queryByText(INVOICE)).not.toBeInTheDocument();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(POLL_MS * 10);
    });
    expect(pollCalls(fetchMock)).toBe(callsBeforeBack);
  });

  it('labels the amount group, custom amount input and message field', async () => {
    await renderTipJar({ initialMemo: 'Thanks!' });

    expect(screen.getByRole('radiogroup', { name: 'Select amount (sats)' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message (optional)')).toHaveValue('Thanks!');

    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    const customAmount = screen.getByLabelText('Custom amount (sats)');
    expect(customAmount.tagName).toBe('INPUT');
    expect(customAmount).toHaveAttribute('inputmode', 'numeric');
  });
});
