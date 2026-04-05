type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;

export function installMatchMediaMock(initialMatches = false) {
  let matches = initialMatches;
  const listeners = new Set<MediaQueryChangeListener>();

  const mediaQueryList = {
    media: '(prefers-reduced-motion: reduce)',
    onchange: null as ((this: MediaQueryList, event: MediaQueryListEvent) => void) | null,
    get matches() {
      return matches;
    },
    addEventListener: jest.fn(
      (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type === 'change' && typeof listener === 'function') {
          listeners.add(listener as MediaQueryChangeListener);
        }
      }
    ),
    removeEventListener: jest.fn(
      (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type === 'change' && typeof listener === 'function') {
          listeners.delete(listener as MediaQueryChangeListener);
        }
      }
    ),
    addListener: jest.fn((listener: MediaQueryChangeListener) => {
      listeners.add(listener);
    }),
    removeListener: jest.fn((listener: MediaQueryChangeListener) => {
      listeners.delete(listener);
    }),
    dispatchEvent: jest.fn((event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent));
      mediaQueryList.onchange?.call(mediaQueryList as MediaQueryList, event as MediaQueryListEvent);
      return true;
    }),
  };

  const matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  });

  return {
    matchMedia,
    mediaQueryList: mediaQueryList as MediaQueryList,
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = {
        matches: nextMatches,
        media: mediaQueryList.media,
      } as MediaQueryListEvent;

      mediaQueryList.dispatchEvent(event as unknown as Event);
    },
  };
}
