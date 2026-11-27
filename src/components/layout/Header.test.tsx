import React from 'react';
import { render, screen, within } from '@testing-library/react';

import Header from '@/components/layout/Header';
import { getSiteNavItems } from '@/config/site-nav';

jest.mock('next/navigation', () => ({
  usePathname: () => '/portfolio',
}));

describe('Header', () => {
  it('renders one navigation landmark beside the brand link', () => {
    render(<Header navItems={getSiteNavItems()} />);

    const navs = screen.getAllByRole('navigation');
    expect(navs).toHaveLength(1);
    expect(navs[0]).toHaveAccessibleName('Main navigation');

    const brand = screen.getByRole('link', { name: 'Saucy.Tech' });
    expect(brand).toHaveAttribute('href', '/');
    expect(navs[0]).not.toContainElement(brand);
  });

  it('gives nav links padded tap targets and marks the current page', () => {
    render(<Header navItems={getSiteNavItems()} />);

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    for (const link of within(nav).getAllByRole('link')) {
      expect(link).toHaveClass('min-h-10', 'px-2.5', 'a11y-focus-ring');
    }

    expect(within(nav).getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(nav).getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
  });

  it('puts the light/dark toggle in the top bar', () => {
    render(<Header navItems={getSiteNavItems()} />);

    expect(screen.getByRole('banner')).toContainElement(
      screen.getByRole('button', { name: 'Dark mode' })
    );
  });
});
