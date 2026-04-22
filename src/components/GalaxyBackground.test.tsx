import React from 'react';
import { act, render } from '@testing-library/react';

import GalaxyBackground from '@/components/GalaxyBackground';
import { installMatchMediaMock } from '@/test-utils/mockMatchMedia';

describe('GalaxyBackground', () => {
  const mockGradient = {
    addColorStop: jest.fn(),
  };
  const mockContext = {
    fillStyle: '',
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    createRadialGradient: jest.fn(() => mockGradient),
  };

  beforeEach(() => {
    let nextFrameId = 1;
    let nextIdleId = 1;

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: jest.fn(() => nextFrameId++),
    });

    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      writable: true,
      value: jest.fn((cb: IdleRequestCallback) => {
        cb({
          didTimeout: false,
          timeRemaining: () => 10,
        } as IdleDeadline);
        return nextIdleId++;
      }),
    });

    Object.defineProperty(window, 'cancelIdleCallback', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: jest.fn(() => mockContext),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('starts animating when reduced motion is off', () => {
    installMatchMediaMock(false);

    const { container } = render(<GalaxyBackground />);

    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('renders a static frame when reduced motion is on', () => {
    installMatchMediaMock(true);

    render(<GalaxyBackground />);

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('responds to live reduced-motion changes without remounting', () => {
    const matchMediaController = installMatchMediaMock(false);

    render(<GalaxyBackground />);

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => {
      matchMediaController.setMatches(true);
    });

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => {
      matchMediaController.setMatches(false);
    });

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
  });
});
