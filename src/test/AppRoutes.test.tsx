import { AppRoutes } from '@/routes/AppRoutes';
import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/routes/routes', () => ({
  routes: [
    {
      path: '/',
      element: <div data-testid="layout">Layout</div>,
      children: [
        {
          index: true,
          element: <div data-testid="home">Home Page</div>,
        },
        {
          path: '/about',
          element: <div data-testid="about">About Page</div>,
        },
      ],
    },
  ],
}));

describe('AppRoutes', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <MantineProvider>
          <AppRoutes />
        </MantineProvider>
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it('should scroll to top when location changes', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(
      <MemoryRouter initialEntries={['/']}>
        <MantineProvider>
          <AppRoutes />
        </MantineProvider>
      </MemoryRouter>
    );

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalled();
  });

  it('should render the routes returned by useRoutes', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <MantineProvider>
          <AppRoutes />
        </MantineProvider>
      </MemoryRouter>
    );

    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('should handle different initial routes', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/about']}>
        <MantineProvider>
          <AppRoutes />
        </MantineProvider>
      </MemoryRouter>
    );

    expect(getByTestId('layout')).toBeInTheDocument();
  });
});
