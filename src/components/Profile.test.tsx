/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@testing-library/react';

import Profile from '@/components/Profile';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill: _fill, priority: _priority, ...props }: React.ComponentProps<'img'>) => (
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

describe('Profile', () => {
  it('renders the bio as wrapped centered text without overflow helpers', () => {
    const bio = 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin';
    const { container } = render(<Profile name="Brandon" bio={bio} imageSrc="/headshot.jpeg" />);

    const bioElement = screen.getByText(bio);

    expect(screen.getByRole('heading', { name: 'Brandon' })).toBeInTheDocument();
    expect(bioElement).toHaveClass('whitespace-normal', 'text-center');
    expect(bioElement.className).not.toContain('sm:whitespace-nowrap');
    expect(container.querySelector('.no-scrollbar')).toBeNull();
  });
});
