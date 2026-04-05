import React from 'react';
import { act, render, screen } from '@testing-library/react';

import ClientSnowflakes from '@/components/ClientSnowflakes';
import { installMatchMediaMock } from '@/test-utils/mockMatchMedia';

jest.mock('@/components/Snowflakes', () => ({
  __esModule: true,
  default: () => <div data-testid="snowflakes-layer" />,
}));

describe('ClientSnowflakes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('suppresses snowflakes when reduced motion is enabled', () => {
    installMatchMediaMock(true);
    window.localStorage.setItem('showSnowflakes', 'true');

    render(<ClientSnowflakes />);

    expect(screen.queryByTestId('snowflakes-layer')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Snowflakes are hidden while Reduce Motion is enabled',
      })
    ).toBeInTheDocument();
  });

  it('restores snowflakes when reduced motion is turned off', () => {
    const matchMediaController = installMatchMediaMock(true);
    window.localStorage.setItem('showSnowflakes', 'true');

    render(<ClientSnowflakes />);

    expect(screen.queryByTestId('snowflakes-layer')).not.toBeInTheDocument();

    act(() => {
      matchMediaController.setMatches(false);
    });

    expect(screen.getByTestId('snowflakes-layer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide snowflakes' })).toBeInTheDocument();
  });
});
