import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import HeaderAppearanceButton from '@/components/HeaderAppearanceButton';
import { APPEARANCE_STORAGE_KEY, applyAppearance } from '@/utils/theme';

describe('HeaderAppearanceButton', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-appearance');
    localStorage.clear();
  });

  it('starts pressed in dark mode and switches the page to light on click', async () => {
    render(<HeaderAppearanceButton />);

    const button = screen.getByRole('button', { name: 'Dark mode' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('a11y-focus-ring');

    fireEvent.click(button);

    expect(document.documentElement).toHaveAttribute('data-appearance', 'light');
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light');
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'false'));

    fireEvent.click(button);

    expect(document.documentElement).not.toHaveAttribute('data-appearance');
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'));
  });

  it('follows appearance changes made elsewhere, such as the footer toggle', async () => {
    render(<HeaderAppearanceButton />);
    const button = screen.getByRole('button', { name: 'Dark mode' });

    act(() => applyAppearance('light'));
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'false'));
    expect(button).toHaveAttribute('title', 'Switch to dark mode');

    act(() => applyAppearance('dark'));
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'));
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('reads a light appearance already set before mount', () => {
    document.documentElement.setAttribute('data-appearance', 'light');
    render(<HeaderAppearanceButton />);

    expect(screen.getByRole('button', { name: 'Dark mode' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
