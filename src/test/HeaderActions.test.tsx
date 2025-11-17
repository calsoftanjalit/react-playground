import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { HeaderActions } from '../components/layout';
import { MemoryRouter } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { CartProvider } from '@/context';

describe('HeaderActions', () => {
  it('renders all action buttons', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <MantineProvider>
            <HeaderActions />
          </MantineProvider>
        </MemoryRouter>
      </CartProvider>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('renders GitHub link', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <MantineProvider>
            <HeaderActions />
          </MantineProvider>
        </MemoryRouter>
      </CartProvider>
    );

    const [cartLink, githubLink] = screen.getAllByRole('link');
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/calsoftanjalit/react-playground'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');

    expect(cartLink).toHaveAttribute('href', ROUTE_PATHS.CART);
  });
});
