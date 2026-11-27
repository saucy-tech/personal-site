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

const bio = 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin';

describe('Profile', () => {
  it('renders the bio as wrapped text without overflow helpers', () => {
    const { container } = render(
      <Profile name="Brandon Sauceda" bio={bio} imageSrc="/headshot.jpeg" />
    );

    const bioElement = screen.getByText(bio);

    expect(bioElement).toHaveClass('whitespace-normal');
    expect(bioElement.className).not.toContain('sm:whitespace-nowrap');
    expect(container.querySelector('.no-scrollbar')).toBeNull();
  });

  it('centers the bio on phones and left-aligns it beside the avatar from sm up', () => {
    render(<Profile name="Brandon Sauceda" bio={bio} imageSrc="/headshot.jpeg" />);

    expect(screen.getByText(bio)).toHaveClass('text-center', 'sm:text-left');
  });

  it('gives the name a larger heading than the section h2s', () => {
    render(<Profile name="Brandon Sauceda" bio={bio} imageSrc="/headshot.jpeg" />);

    const heading = screen.getByRole('heading', { level: 1, name: 'Brandon Sauceda' });
    expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'tracking-tight');
    expect(heading.className).not.toContain('text-2xl');
  });

  it('renders the headshot with descriptive alt text', () => {
    render(<Profile name="Brandon Sauceda" bio={bio} imageSrc="/headshot.jpeg" />);

    expect(screen.getByRole('img', { name: "Brandon Sauceda's profile photo" })).toHaveAttribute(
      'src',
      '/headshot.jpeg'
    );
  });
});
