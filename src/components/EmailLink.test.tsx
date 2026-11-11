import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import EmailLink from '@/components/EmailLink';

describe('EmailLink', () => {
  it('keeps the address out of the server HTML', () => {
    const html = renderToString(<EmailLink subject="Hello there" />);

    expect(html).not.toContain('saucy');
    expect(html).not.toContain('mailto');
    expect(html).toContain('my email address');
  });

  it('shows the address as a mailto link in the browser', () => {
    render(<EmailLink />);

    expect(screen.getByRole('link', { name: 'contact@saucy.tech' })).toHaveAttribute(
      'href',
      'mailto:contact@saucy.tech'
    );
  });

  it('keeps a custom label and adds the subject', () => {
    render(<EmailLink subject="Trump Account contribution link">Request the link</EmailLink>);

    expect(screen.getByRole('link', { name: 'Request the link' })).toHaveAttribute(
      'href',
      'mailto:contact@saucy.tech?subject=Trump%20Account%20contribution%20link'
    );
  });
});
