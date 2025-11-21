import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

vi.mock('@/components/miscellaneous', () => ({
  RouteErrorFallback: () => <div data-testid="error">Route Error</div>,
  GlobalErrorFallback: () => <div>Global Error</div>,
}));

vi.mock('@/components/layout', () => ({
  Layout: () => <div data-testid="layout">Layout</div>,
}));

describe('AppRoutes', () => {
  it('should render the home route', async () => {
    const { routes } = await import('@/routes/routes');
    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
    });

    const { getByTestId } = render(<RouterProvider router={router} />);
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('should render the about route', async () => {
    const { routes } = await import('@/routes/routes');
    const router = createMemoryRouter(routes, {
      initialEntries: ['/about'],
    });

    const { getByTestId } = render(<RouterProvider router={router} />);
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('should render error fallback for unknown routes', async () => {
    const { routes } = await import('@/routes/routes');
    const router = createMemoryRouter(routes, {
      initialEntries: ['/unknown-route'],
    });

    const { getByTestId } = render(<RouterProvider router={router} />);
    expect(getByTestId('error')).toBeInTheDocument();
  });
});
