import React from 'react';
import { render, screen } from '@testing-library/react';

import PageLayout from '@/components/PageLayout';

describe('PageLayout', () => {
  it('omits the back link when no backHref is passed', () => {
    render(
      <PageLayout title="Portfolio">
        <p>Body</p>
      </PageLayout>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders the back link when backHref is passed', () => {
    render(
      <PageLayout title="Résumé" backHref="/portfolio" backLabel="Back to Portfolio">
        <p>Body</p>
      </PageLayout>
    );

    expect(screen.getByRole('link', { name: 'Back to Portfolio' })).toHaveAttribute(
      'href',
      '/portfolio'
    );
  });

  it('defaults the back label to Back to Home', () => {
    render(
      <PageLayout title="Blog" backHref="/">
        <p>Body</p>
      </PageLayout>
    );

    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
  });

  it('leaves min height and side padding to the root layout', () => {
    const { container, rerender } = render(
      <PageLayout title="Wide">
        <p>Body</p>
      </PageLayout>
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('w-full');
    expect(root.className).not.toMatch(/min-h-screen|container|\bpx-/);
    expect(container.querySelector('.min-h-screen')).toBeNull();

    rerender(
      <PageLayout title="Narrow" readingWidth>
        <p>Body</p>
      </PageLayout>
    );
    expect(container.firstElementChild).toHaveClass('max-w-3xl');
  });
});
