import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutPage from '@/pages/CheckoutPage';
import { useCartStore } from '@/context';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { useMantineColorScheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import {  CheckoutCart } from '@/types/checkout';

vi.mock('@/context', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/hooks/useCheckoutFormContext', () => ({
  useCheckoutFormContext: vi.fn(),
}));

vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('@/components/checkout', () => ({
  CheckoutForm: ({ onSubmitSuccess }: { onSubmitSuccess: (summary: { id: string }) => void }) => (
    <button onClick={() => onSubmitSuccess({ id: 'order-123' })}>Submit Order</button>
  ),
  OrderSuccess: ({ orderSummary }: { orderSummary: { id: string } }) => (
    <div>Order Success: {orderSummary.id}</div>
  ),
  OrderSummaryCard: ({ onCartUpdate }: { onCartUpdate: (cart: CheckoutCart) => void }) => (
    <button onClick={() => onCartUpdate({ items: [], pricing: {
      total: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0
    } })}>
      Update Cart
    </button>
  ),
}));

vi.mock('@/utils', () => ({
  calculatePricing: vi.fn(() => ({ total: 100 })),
}));

describe('CheckoutPage', () => {
  const mockNavigate = vi.fn();
  const mockClearFormData = vi.fn();
  const mockClearCart = vi.fn();
  const mockUpdateItem = vi.fn();
  const mockCartItems = [{ id: 1, title: 'Product 1', price: 50, quantity: 1 }];

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ state: null });
    (useCheckoutFormContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      clearFormData: mockClearFormData,
    });
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: mockCartItems,
      clearCart: mockClearCart,
      updateItem: mockUpdateItem,
    });
    (useMantineColorScheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      colorScheme: 'light',
    });
  });

  const renderComponent = () => {
    return render(
      <MantineProvider>
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      </MantineProvider>
    );
  };

  it('should clear form data on mount', () => {
    renderComponent();
    expect(mockClearFormData).toHaveBeenCalled();
  });

  it('should render empty cart state when no items', () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      clearCart: mockClearCart,
      updateItem: mockUpdateItem,
    });

    renderComponent();

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('should navigate to home when clicking continue shopping', () => {
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      clearCart: mockClearCart,
      updateItem: mockUpdateItem,
    });

    renderComponent();

    fireEvent.click(screen.getByText('Continue Shopping'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PATHS.HOME);
  });

  it('should render checkout form when items exist', () => {
    renderComponent();

    expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
    expect(screen.getByText('Submit Order')).toBeInTheDocument();
  });

  it('should handle buy now item from location state', () => {
    const buyNowItem = { id: 2, title: 'Buy Now Product', price: 100, quantity: 1 };
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { buyNowItem },
    });

    renderComponent();

    expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
  });

  it('should handle order submission success', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Submit Order'));

    expect(screen.getByText('Order Success: order-123')).toBeInTheDocument();
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('should not clear cart on success if buy now item', () => {
    const buyNowItem = { id: 2, title: 'Buy Now Product', price: 100, quantity: 1 };
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      state: { buyNowItem },
    });

    renderComponent();

    fireEvent.click(screen.getByText('Submit Order'));

    expect(screen.getByText('Order Success: order-123')).toBeInTheDocument();
    expect(mockClearCart).not.toHaveBeenCalled();
  });

  it('should handle cart updates', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Update Cart'));

  });
  
  it('should redirect to cart if items become empty and no order summary', async () => {
      (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      clearCart: mockClearCart,
      updateItem: mockUpdateItem,
    });
    
    vi.useFakeTimers();
    renderComponent();
    
    act(() => {
        vi.advanceTimersByTime(100);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_PATHS.CART);
    vi.useRealTimers();
  });
});
