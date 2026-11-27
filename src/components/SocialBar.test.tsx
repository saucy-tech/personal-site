import React from 'react';
import { render, screen } from '@testing-library/react';

import SocialBar from '@/components/SocialBar';
import { SocialIcon } from '@/components/SocialIcons';
import { SOCIAL_PROFILES } from '@/utils/constants';

const socials = [
  {
    href: SOCIAL_PROFILES.linkedIn,
    icon: <SocialIcon name="linkedIn" />,
    label: 'LinkedIn',
  },
  { href: SOCIAL_PROFILES.github, icon: <SocialIcon name="github" />, label: 'GitHub' },
  { href: SOCIAL_PROFILES.x, icon: <SocialIcon name="x" />, label: 'X' },
];

describe('SocialBar', () => {
  it('renders labelled profile links that open in a new tab with rel="me"', () => {
    render(<SocialBar socials={socials} />);

    for (const { href, label } of socials) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')?.split(' ')).toEqual(
        expect.arrayContaining(['noopener', 'noreferrer', 'me'])
      );
    }
  });

  it('draws the marks in currentColor so they follow the palette accent', () => {
    const { container } = render(<SocialBar socials={socials} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveClass('text-(--accent)');
      const svg = link.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    }
    expect(container.innerHTML.toLowerCase()).not.toContain('#f7931a');
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders nothing without socials', () => {
    const { container } = render(<SocialBar socials={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
