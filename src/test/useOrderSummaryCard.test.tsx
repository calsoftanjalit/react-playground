import { useOrderSummaryCard } from '@/hooks/useOrderSummaryCard';
import { CheckoutCart } from '@/types/checkout';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOrderSummaryCard', () => {
  const mockCart: CheckoutCart = {
    items: [
      {
        id: 1,
        title: 'Test Product 1',
        price: 99.99,
        quantity: 2,
        thumbnail: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        title: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        thumbnail: 'https://example.com/image2.jpg',
      },
    ],
    pricing: {
      subtotal: 249.97,
      shipping: 10,
      tax: 23.40,
      discount: 0,
      total: 283.37,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with provided cart data', () => {
    const { result } = renderHook(() =>
      useOrderSummaryCard({
        cart: mockCart,
      })
    );

    expect(result.current.localCart).toEqual(mockCart);
    expect(result.current.itemCount).toBe(3);
  });

  it('calculates correct item count', () => {
    const cartWithMultipleItems: CheckoutCart = {
      ...mockCart,
      items: [
        { id: 1, title: 'Product 1', price: 10, quantity: 5, thumbnail: '' },
        { id: 2, title: 'Product 2', price: 20, quantity: 3, thumbnail: '' },
        { id: 3, title: 'Product 3', price: 30, quantity: 2, thumbnail: '' },
      ],
    };

    const { result } = renderHook(() =>
      useOrderSummaryCard({
        cart: cartWithMultipleItems,
      })
    );

    expect(result.current.itemCount).toBe(10);
  });

  it('updates local cart when cart prop changes', () => {
    const { result, rerender } = renderHook(
      ({ cart }) =>
        useOrderSummaryCard({
          cart,
        }),
      {
        initialProps: { cart: mockCart },
      }
    );

    expect(result.current.localCart).toEqual(mockCart);

    const updatedCart: CheckoutCart = {
      ...mockCart,
      items: [mockCart.items[0]!],
      pricing: {
        ...mockCart.pricing,
        subtotal: 199.98,
        total: 229.78,
      },
    };

    rerender({ cart: updatedCart });

    expect(result.current.localCart).toEqual(updatedCart);
    expect(result.current.itemCount).toBe(2);
  });

  describe('Quantity Change Handling', () => {
    it('updates item quantity correctly', () => {
      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
          onCartUpdate,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 3);
      });

      expect(result.current.localCart.items[0]?.quantity).toBe(3);
      expect(onCartUpdate).toHaveBeenCalledTimes(1);
    });

    it('recalculates pricing when quantity changes', () => {
      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
          onCartUpdate,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 5);
      });

      const updatedCart = onCartUpdate.mock.calls[0]?.[0] as CheckoutCart;
      expect(updatedCart.items[0]?.quantity).toBe(5);
      expect(updatedCart.pricing).toBeDefined();
      expect(updatedCart.pricing.subtotal).toBeGreaterThan(mockCart.pricing.subtotal);
    });

    it('does not call onCartUpdate when not provided', () => {
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 3);
      });

      expect(result.current.localCart.items[0]?.quantity).toBe(3);
    });

    it('handles quantity change for multiple items', () => {
      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
          onCartUpdate,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 10);
      });

      expect(result.current.localCart.items[0]?.quantity).toBe(10);
      expect(result.current.localCart.items[1]?.quantity).toBe(1);

      act(() => {
        result.current.handleQuantityChange(2, 5);
      });

      expect(result.current.localCart.items[1]?.quantity).toBe(5);
      expect(onCartUpdate).toHaveBeenCalledTimes(2);
    });

    it('preserves discount when recalculating pricing', () => {
      const cartWithDiscount: CheckoutCart = {
        ...mockCart,
        pricing: {
          ...mockCart.pricing,
          discount: 25,
        },
      };

      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: cartWithDiscount,
          onCartUpdate,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 3);
      });

      const updatedCart = onCartUpdate.mock.calls[0]?.[0] as CheckoutCart;
      expect(updatedCart.pricing).toBeDefined();
    });

    it('handles non-existent item ID gracefully', () => {
      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
          onCartUpdate,
        })
      );

      const originalItems = [...result.current.localCart.items];

      act(() => {
        result.current.handleQuantityChange(999, 10);
      });

      expect(result.current.localCart.items).toHaveLength(originalItems.length);
      expect(onCartUpdate).toHaveBeenCalledTimes(1);
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
          discount: 0,
          total: 0,
        },
      };

      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: emptyCart,
        })
      );

      expect(result.current.itemCount).toBe(0);
      expect(result.current.localCart.items).toHaveLength(0);
    });

    it('handles cart with single item', () => {
      const singleItemCart: CheckoutCart = {
        items: [mockCart.items[0]!],
        pricing: {
          subtotal: 199.98,
          shipping: 10,
          tax: 18.90,
          discount: 0,
          total: 228.88,
        },
      };

      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: singleItemCart,
        })
      );

      expect(result.current.itemCount).toBe(2);
      expect(result.current.localCart.items).toHaveLength(1);
    });

    it('handles zero quantity correctly', () => {
      const onCartUpdate = vi.fn();
      const { result } = renderHook(() =>
        useOrderSummaryCard({
          cart: mockCart,
          onCartUpdate,
        })
      );

      act(() => {
        result.current.handleQuantityChange(1, 0);
      });

      expect(result.current.localCart.items[0]?.quantity).toBe(0);
      expect(onCartUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
