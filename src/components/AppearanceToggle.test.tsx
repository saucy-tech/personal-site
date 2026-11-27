import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import AppearanceToggle from '@/components/AppearanceToggle';

afterEach(() => {
  document.documentElement.removeAttribute('data-appearance');
  localStorage.clear();
});

describe('AppearanceToggle', () => {
  it('marks the active appearance as pressed and follows a change', async () => {
    render(<AppearanceToggle />);

    const light = screen.getByRole('button', { name: 'Light' });
    const dark = screen.getByRole('button', { name: 'Dark' });
    expect(dark).toHaveAttribute('aria-pressed', 'true');
    expect(light).toHaveAttribute('aria-pressed', 'false');
    expect(light).toHaveClass('a11y-focus-ring');

    fireEvent.click(light);

    await waitFor(() => expect(light).toHaveAttribute('aria-pressed', 'true'));
    expect(dark).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement).toHaveAttribute('data-appearance', 'light');
  });
});
