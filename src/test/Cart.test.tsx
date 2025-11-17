import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import Cart from '@/pages/Cart';
import { CartProvider } from '@/context';

vi.mock('@/components/Cart/CartTable', () => ({
  default: () => <div>Mock CartTable</div>,
}));

vi.mock('@/context', () => ({
  useCartStore: () => ({
    totalItems: 2,
  }),
  CartProvider: ({ children }: any) => <div>{children}</div>,
}));

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <CartProvider>
      <MantineProvider>{ui}</MantineProvider>
    </CartProvider>
  );

describe('<Cart /> component', () => {
  it('renders static UI elements correctly', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText(/cart items/i)).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByText('Mock CartTable')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /checkout/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  it('renders Checkout button with Mantine Button root class', () => {
    renderWithProviders(<Cart />);

    const btn = screen.getByRole('button', { name: /checkout/i });
    expect(btn.className).toMatch(/mantine-Button-root/);
  });

});
