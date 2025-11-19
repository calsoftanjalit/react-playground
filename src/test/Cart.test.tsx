import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '@/pages/Cart';
import { CartProvider } from '@/context';
import { ROUTE_PATHS } from '@/routes';

vi.mock('@/components/Cart/CartTable', () => ({
  default: () => <div>Mock CartTable</div>,
}));

const mockNavigate = vi.fn();
const mockClearFormData = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/hooks/useCheckoutFormContext', () => ({
  useCheckoutFormContext: () => ({
    clearFormData: mockClearFormData,
  }),
}));

vi.mock('@/context', () => ({
  useCartStore: () => ({
    items: [{ id: 1 }],
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
  beforeEach(() => vi.clearAllMocks());

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

  it('navigates to checkout and clears form on click', () => {
    renderWithProviders(<Cart />);

    const btn = screen.getByRole('button', { name: /checkout/i });
    fireEvent.click(btn);

    expect(mockClearFormData).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PATHS.CART_CHECKOUT);
  });
});
