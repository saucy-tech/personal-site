import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ThemeToggle from '@/components/ThemeToggle';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('marks the active color mode as pressed and follows a change', async () => {
    render(<ThemeToggle />);

    const orange = screen.getByRole('button', { name: 'Orange' });
    const green = screen.getByRole('button', { name: 'Green' });
    expect(orange).toHaveAttribute('aria-pressed', 'true');
    expect(green).toHaveAttribute('aria-pressed', 'false');
    expect(orange).toHaveClass('a11y-focus-ring');

    fireEvent.click(green);

    await waitFor(() => expect(green).toHaveAttribute('aria-pressed', 'true'));
    expect(orange).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement).toHaveAttribute('data-theme', 'green');
  });
});
