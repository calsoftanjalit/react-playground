import { OrderSummaryCard } from '@/components/checkout/OrderSummaryCard';
import { CheckoutCart } from '@/types/checkout';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockCart: CheckoutCart = {
  items: [
    {
      id: 1,
      title: 'Product 1',
      price: 50.00,
      quantity: 2,
      thumbnail: 'https://example.com/1.jpg',
    },
    {
      id: 2,
      title: 'Product 2',
      price: 30.00,
      quantity: 1,
      thumbnail: 'https://example.com/2.jpg',
    },
  ],
  pricing: {
    subtotal: 130.00,
    shipping: 10,
    tax: 11.70,
    total: 151.70,
  },
};

const renderOrderSummaryCard = (props: Partial<React.ComponentProps<typeof OrderSummaryCard>> = {}) => {
  return render(
    <MantineProvider>
      <OrderSummaryCard cart={mockCart} {...props} />
    </MantineProvider>
  );
};

describe('OrderSummaryCard', () => {
  describe('Rendering', () => {
    it('renders order summary title', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    it('displays correct item count badge', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders all cart items', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('displays subtotal correctly', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('$130.00')).toBeInTheDocument();
    });

    it('displays shipping cost', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('$10.00')).toBeInTheDocument();
    });

    it('displays tax with correct percentage', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('Tax (9%)')).toBeInTheDocument();
      expect(screen.getByText('$11.70')).toBeInTheDocument();
    });

    it('displays total amount', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('$151.70')).toBeInTheDocument();
    });
  });

  describe('Free Shipping', () => {
    it('shows FREE when shipping cost is 0', () => {
      const cartWithFreeShipping: CheckoutCart = {
        ...mockCart,
        pricing: {
          ...mockCart.pricing,
          shipping: 0,
        },
      };

      renderOrderSummaryCard({ cart: cartWithFreeShipping });

      expect(screen.getByText('FREE')).toBeInTheDocument();
    });

    it('applies green color to free shipping text', () => {
      const cartWithFreeShipping: CheckoutCart = {
        ...mockCart,
        pricing: {
          ...mockCart.pricing,
          shipping: 0,
        },
      };

      renderOrderSummaryCard({ cart: cartWithFreeShipping });

      const freeText = screen.getByText('FREE');
      expect(freeText).toBeInTheDocument();
    });

    it('shows shipping cost when not free', () => {
      renderOrderSummaryCard();

      expect(screen.getByText('$10.00')).toBeInTheDocument();
      expect(screen.queryByText('FREE')).not.toBeInTheDocument();
    });
  });

  describe('Discount Display', () => {
    it('shows discount when present', () => {
      const cartWithDiscount: CheckoutCart = {
        ...mockCart,
        pricing: {
          ...mockCart.pricing,
          discount: 20.00,
        },
      };

      renderOrderSummaryCard({ cart: cartWithDiscount });

      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('-$20.00')).toBeInTheDocument();
    });

    it('does not show discount section when discount is 0', () => {
      renderOrderSummaryCard();

      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('does not show discount when undefined', () => {
      const cartNoDiscount: CheckoutCart = {
        ...mockCart,
        pricing: {
          ...mockCart.pricing,
          discount: undefined,
        },
      };

      renderOrderSummaryCard({ cart: cartNoDiscount });

      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('shows quantity controls when onCartUpdate is provided', () => {
      const onCartUpdate = vi.fn();
      renderOrderSummaryCard({ onCartUpdate });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('does not show quantity controls when onCartUpdate is not provided', () => {
      renderOrderSummaryCard({ onCartUpdate: undefined });

      expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
      expect(screen.getByText(/qty: 1/i)).toBeInTheDocument();
    });

    it('updates cart when quantity is changed', async () => {
      const onCartUpdate = vi.fn();
      const user = userEvent.setup();

      renderOrderSummaryCard({ onCartUpdate });

      const buttons = screen.getAllByRole('button');
      const plusButtons = buttons.filter((_, index) => index % 2 === 1);
      await user.click(plusButtons[0]);

      expect(onCartUpdate).toHaveBeenCalled();
      const updatedCart = onCartUpdate.mock.calls[0][0];
      expect(updatedCart.items[0].quantity).toBe(3);
    });

    it('recalculates pricing when quantity changes', async () => {
      const onCartUpdate = vi.fn();
      const user = userEvent.setup();

      renderOrderSummaryCard({ onCartUpdate });

      const buttons = screen.getAllByRole('button');
      const plusButtons = buttons.filter((_, index) => index % 2 === 1);
      await user.click(plusButtons[0]);

      const updatedCart = onCartUpdate.mock.calls[0][0];
      expect(updatedCart.pricing.subtotal).toBeGreaterThan(mockCart.pricing.subtotal);
    });

    it('updates local state when quantity changes', async () => {
      const onCartUpdate = vi.fn();
      const user = userEvent.setup();

      renderOrderSummaryCard({ onCartUpdate });

      const buttons = screen.getAllByRole('button');
      const plusButtons = buttons.filter((_, index) => index % 2 === 1);
      await user.click(plusButtons[0]);

      expect(onCartUpdate).toHaveBeenCalled();
    });
  });

  describe('ScrollArea Behavior', () => {
    it('sets auto height when 2 or fewer items', () => {
      const smallCart: CheckoutCart = {
        items: mockCart.items.slice(0, 2),
        pricing: mockCart.pricing,
      };

      renderOrderSummaryCard({ cart: smallCart });

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('sets fixed height when more than 2 items', () => {
      const largeCart: CheckoutCart = {
        items: [
          ...mockCart.items,
          {
            id: 3,
            title: 'Product 3',
            price: 25.00,
            quantity: 1,
            thumbnail: 'https://example.com/3.jpg',
          },
        ],
        pricing: mockCart.pricing,
      };

      renderOrderSummaryCard({ cart: largeCart });

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });
  });

  describe('Sticky Behavior', () => {
    it('applies sticky class by default', () => {
      const { container } = renderOrderSummaryCard();

      const papers = container.querySelectorAll('[class*="orderSummaryCard"]');
      expect(papers.length).toBeGreaterThan(0);
    });

    it('does not apply sticky class when isSticky is false', () => {
      const { container } = renderOrderSummaryCard({ isSticky: false });

      const papers = container.querySelectorAll('[class*="orderSummaryCard"]');
      expect(papers.length).toBe(0);
    });
  });

  describe('Cart Updates', () => {
    it('updates local cart when cart prop changes', () => {
      const { rerender } = renderOrderSummaryCard();

      const newCart: CheckoutCart = {
        items: [
          {
            id: 1,
            title: 'Updated Product',
            price: 99.99,
            quantity: 1,
            thumbnail: 'https://example.com/new.jpg',
          },
        ],
        pricing: {
          subtotal: 99.99,
          shipping: 0,
          tax: 8.99,
          total: 108.98,
        },
      };

      rerender(
        <MantineProvider>
          <OrderSummaryCard cart={newCart} />
        </MantineProvider>
      );

      expect(screen.getByText('Updated Product')).toBeInTheDocument();
      expect(screen.getAllByText('$99.99')[0]).toBeInTheDocument();
    });

    it('recalculates item count when items change', () => {
      const { rerender } = renderOrderSummaryCard();

      const newCart: CheckoutCart = {
        items: [
          {
            id: 1,
            title: 'Product',
            price: 50.00,
            quantity: 5,
            thumbnail: 'https://example.com/1.jpg',
          },
        ],
        pricing: mockCart.pricing,
      };

      rerender(
        <MantineProvider>
          <OrderSummaryCard cart={newCart} />
        </MantineProvider>
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty cart', () => {
      const emptyCart: CheckoutCart = {
        items: [],
        pricing: {
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        },
      };

      renderOrderSummaryCard({ cart: emptyCart });

      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);
    });

    it('handles single item cart', () => {
      const singleItemCart: CheckoutCart = {
        items: [mockCart.items[0]],
        pricing: {
          subtotal: 100.00,
          shipping: 10,
          tax: 9.00,
          total: 119.00,
        },
      };

      renderOrderSummaryCard({ cart: singleItemCart });

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('handles very large quantities', () => {
      const largeQuantityCart: CheckoutCart = {
        items: [
          {
            id: 1,
            title: 'Product',
            price: 10.00,
            quantity: 999,
            thumbnail: 'https://example.com/1.jpg',
          },
        ],
        pricing: mockCart.pricing,
      };

      renderOrderSummaryCard({ cart: largeQuantityCart });

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('formats prices with two decimal places', () => {
      const decimalCart: CheckoutCart = {
        items: mockCart.items,
        pricing: {
          subtotal: 123.456,
          shipping: 10.111,
          tax: 11.111,
          total: 144.678,
        },
      };

      renderOrderSummaryCard({ cart: decimalCart });

      expect(screen.getByText('$123.46')).toBeInTheDocument();
      expect(screen.getByText('$10.11')).toBeInTheDocument();
      expect(screen.getByText('$11.11')).toBeInTheDocument();
      expect(screen.getByText('$144.68')).toBeInTheDocument();
    });
  });
});
