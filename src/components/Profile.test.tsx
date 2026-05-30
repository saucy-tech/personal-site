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

jest.mock('framer-motion', () => {
  const createMotionComponent = (tag: 'div' | 'p') => {
    const MotionComponent = ({
      children,
      initial: _initial,
      animate: _animate,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(tag, props, children);

    MotionComponent.displayName = `motion.${tag}`;
    return MotionComponent;
  };

  return {
    motion: {
      div: createMotionComponent('div'),
      p: createMotionComponent('p'),
    },
  };
});

describe('Profile', () => {
  it('renders the bio as wrapped centered text without overflow helpers', () => {
    const bio = 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin';
    const { container } = render(
      <Profile name="Brandon" bio={bio} imageSrc="/headshot.jpeg" />
    );

    const bioElement = screen.getByText(bio);

    expect(screen.getByRole('heading', { name: 'Brandon' })).toBeInTheDocument();
    expect(bioElement).toHaveClass('whitespace-normal', 'text-center');
    expect(bioElement.className).not.toContain('sm:whitespace-nowrap');
    expect(container.querySelector('.no-scrollbar')).toBeNull();
  });
});
