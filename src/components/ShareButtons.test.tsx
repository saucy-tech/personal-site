import React from 'react';
import { render, screen } from '@testing-library/react';

import ShareButtons from '@/components/ShareButtons';

describe('ShareButtons', () => {
  it('shows the X logomark, not a close icon, on the X share link', () => {
    render(<ShareButtons title="A post" url="https://example.com/blog/a-post" />);

    const xLink = screen.getByRole('link', { name: 'Share on X (Twitter)' });
    const icon = xLink.querySelector('svg');

    expect(icon).toHaveAttribute('fill', 'currentColor');
    expect(icon).not.toHaveAttribute('stroke');
    expect(icon?.querySelector('path')?.getAttribute('d')).toMatch(/^M18\.244 2\.25h3\.308/);
  });

  it('gives every share control a visible focus ring', () => {
    render(<ShareButtons title="A post" url="https://example.com/blog/a-post" />);

    const controls = [...screen.getAllByRole('button'), ...screen.getAllByRole('link')];

    expect(controls).toHaveLength(5);
    controls.forEach((control) => expect(control).toHaveClass('a11y-focus-ring'));
  });
});
