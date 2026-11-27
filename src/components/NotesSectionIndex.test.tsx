import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import NotesSectionIndex from '@/components/NotesSectionIndex';

const sections = [
  { id: 'one', title: 'One' },
  { id: 'two', title: 'Two' },
  { id: 'three', title: 'Three' },
];

// jsdom has no layout, IntersectionObserver or scrollIntoView, so stub them.
let scrollLeft = 0;

beforeEach(() => {
  scrollLeft = 0;
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  })) as unknown as typeof IntersectionObserver;
  Element.prototype.scrollIntoView = jest.fn();
  jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(600);
  jest.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(300);
  jest.spyOn(Element.prototype, 'scrollLeft', 'get').mockImplementation(() => scrollLeft);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NotesSectionIndex', () => {
  it('links every section and marks the first as current', () => {
    render(<NotesSectionIndex sections={sections} />);

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#one', '#two', '#three']);
    expect(links[0]).toHaveAttribute('aria-current', 'location');
  });

  it('does not scroll the page to reveal the active chip on load', () => {
    render(<NotesSectionIndex sections={sections} layout="bar" />);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrolls a focused chip into view', () => {
    render(<NotesSectionIndex sections={sections} />);
    const link = screen.getByRole('link', { name: 'Three' });
    jest.mocked(Element.prototype.scrollIntoView).mockClear();

    fireEvent.focus(link);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });
  });

  it('fades the right edge only while chips overflow to the right', () => {
    render(<NotesSectionIndex sections={sections} layout="bar" />);
    const list = screen.getByRole('list');

    expect(list.className).toContain('mask-image');

    scrollLeft = 300;
    fireEvent.scroll(list);

    expect(list.className).not.toContain('mask-image');
  });
});
