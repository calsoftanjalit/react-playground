import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '@/pages/Cart';
import { CartProvider } from '@/context';
import { ROUTE_PATHS } from '@/routes';
import { PropsWithChildren } from 'react';

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

const mockUseCartStore = vi.fn(() => ({
  items: [{ id: 1 }],
  totalItems: 2,
}));

vi.mock('@/context', () => ({
  useCartStore: () => mockUseCartStore(),
  CartProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
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

  it('does not navigate when cart is empty (items.length === 0)', () => {
    mockUseCartStore.mockReturnValueOnce({
      items: [],
      totalItems: 1,
    });

    renderWithProviders(<Cart />);

    const btn = screen.getByRole('button', { name: /checkout/i });
    
    expect(btn).toBeInTheDocument();
    
    fireEvent.click(btn);
    
    expect(mockClearFormData).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not render checkout button when totalItems is 0', () => {
    mockUseCartStore.mockReturnValueOnce({
      items: [{ id: 1 }],
      totalItems: 0,
    });

    renderWithProviders(<Cart />);

    const btn = screen.queryByRole('button', { name: /checkout/i });
    expect(btn).not.toBeInTheDocument();
  });
});
