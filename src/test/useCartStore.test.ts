import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { CartProvider , useCartStore} from '@/context';
import { getUserCartKey } from '@/constants/cart';
import type { CartItem } from '@/types/cart';
import type { AuthUser } from '@/types/auth';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('zustand/middleware', async (importOriginal) => {
  const original = await importOriginal<typeof import('zustand/middleware')>();
  return {
    ...original,
    persist: (fn: Parameters<typeof original.persist>[0]) => fn,
  };
});

let mockAuthState = {
  user: { id: 1, username: 'testuser', email: 'test@example.com' },
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

vi.mock('@/hooks/useAuthStore', () => {
  const useAuthStore = () => mockAuthState;
  useAuthStore.getState = () => mockAuthState;
  useAuthStore.setState = vi.fn();
  useAuthStore.subscribe = vi.fn(() => () => {});
  useAuthStore.destroy = vi.fn();
  return { useAuthStore };
});

const CART_STORAGE_KEY = getUserCartKey(1);

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const wrapper = ({ children }: { children: ReactNode }) => {
  return CartProvider({ children });
};

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockAuthState = {
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('should throw error when used outside CartProvider', () => {
      expect(() => {
        renderHook(() => useCartStore());
      }).toThrow('useCartStore must be used within a CartProvider');
    });

    it('should load cart from localStorage on mount', async () => {
      const cartData: CartItem[] = [
        { id: 1, title: 'Product 1', price: 50, quantity: 2 },
        { id: 2, title: 'Product 2', price: 75, quantity: 1 },
      ];

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));

      const { result } = renderHook(() => useCartStore(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toEqual(cartData);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(175);
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      const newItem = { id: 1, title: 'Product 1', price: 99.99 };

      act(() => {
        result.current.addItem(newItem);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });

      expect(result.current.items[0]).toEqual({
        ...newItem,
        quantity: 1,
      });
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBeCloseTo(99.99, 2);
    });

    it('should increase quantity when adding existing item', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      const item = { id: 1, title: 'Product 1', price: 50 };

      act(() => {
        result.current.addItem(item);
        result.current.addItem(item);
        result.current.addItem(item);
      });

      await waitFor(() => {
        expect(result.current.items[0].quantity).toBe(3);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(150);
    });

    it('should add multiple different items', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      const item1 = { id: 1, title: 'Product 1', price: 50 };
      const item2 = { id: 2, title: 'Product 2', price: 75 };
      const item3 = { id: 3, title: 'Product 3', price: 25 };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.addItem(item3);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(3);
      });

      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(150);
    });

    it('should handle decimal prices correctly', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      const item = { id: 1, title: 'Product', price: 19.99 };

      act(() => {
        result.current.addItem(item);
        result.current.addItem(item);
        result.current.addItem(item);
      });

      await waitFor(() => {
        expect(result.current.totalItems).toBe(3);
      });

      expect(result.current.totalPrice).toBeCloseTo(59.97, 2);
    });
  });

  describe('updateItem', () => {
    it('should update item quantity', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.updateItem(1, 5);
      });

      await waitFor(() => {
        expect(result.current.items[0].quantity).toBe(5);
      });

      expect(result.current.totalItems).toBe(5);
      expect(result.current.totalPrice).toBe(250);
    });

    it('should remove item when quantity set to 0', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.updateItem(1, 0);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });

      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('should remove item when quantity set to negative', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.updateItem(1, -5);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });

      expect(result.current.totalItems).toBe(0);
    });

    it('should handle updating non-existent item gracefully', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.updateItem(999, 5);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });
    });

    it('should update quantity for specific item without affecting others', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
      });

      act(() => {
        result.current.updateItem(1, 10);
      });

      await waitFor(() => {
        expect(result.current.items[0].quantity).toBe(10);
        expect(result.current.items[1].quantity).toBe(1);
      });

      expect(result.current.totalPrice).toBe(575);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
      });

      act(() => {
        result.current.removeItem(1);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });

      expect(result.current.items[0].id).toBe(2);
      expect(result.current.totalPrice).toBe(75);
    });

    it('should handle removing non-existent item gracefully', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.removeItem(999);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });
    });

    it('should maintain other items when removing one', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
        result.current.addItem({ id: 3, title: 'Product 3', price: 25 });
      });

      act(() => {
        result.current.removeItem(2);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(2);
      });

      expect(result.current.items.map((i) => i.id)).toEqual([1, 3]);
      expect(result.current.totalPrice).toBe(75);
    });
  });

  describe('clearCart', () => {
    it('should clear entire cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });

      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('should handle clearing empty cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.clearCart();
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 10 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 20 });
        result.current.addItem({ id: 3, title: 'Product 3', price: 30 });
      });

      await waitFor(() => {
        expect(result.current.totalPrice).toBe(60);
      });
    });

    it('should return 0 for empty cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      expect(result.current.totalPrice).toBe(0);
    });
  });

  describe('getTotalItems', () => {
    it('should calculate total items correctly', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
        result.current.addItem({ id: 3, title: 'Product 3', price: 25 });
      });

      await waitFor(() => {
        expect(result.current.totalItems).toBe(3);
      });
    });

    it('should sum quantities of all items', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
      });

      act(() => {
        result.current.updateItem(1, 5);
        result.current.updateItem(2, 3);
      });

      await waitFor(() => {
        expect(result.current.totalItems).toBe(8);
      });
    });

    it('should return 0 for empty cart', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist cart to localStorage on add', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      await waitFor(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        expect(savedCart).toBeTruthy();
      });

      const parsedCart = JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY) || '[]'
      );
      expect(parsedCart).toHaveLength(1);
      expect(parsedCart[0]).toEqual({
        id: 1,
        title: 'Product 1',
        price: 50,
        quantity: 1,
      });
    });

    it('should persist cart to localStorage on update', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.updateItem(1, 5);
      });

      await waitFor(() => {
        const savedCart = JSON.parse(
          localStorage.getItem(CART_STORAGE_KEY) || '[]'
        );
        expect(savedCart[0].quantity).toBe(5);
      });
    });

    it('should persist cart to localStorage on remove', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
        result.current.addItem({ id: 2, title: 'Product 2', price: 75 });
      });

      act(() => {
        result.current.removeItem(1);
      });

      await waitFor(() => {
        const savedCart = JSON.parse(
          localStorage.getItem(CART_STORAGE_KEY) || '[]'
        );
        expect(savedCart).toHaveLength(1);
        expect(savedCart[0].id).toBe(2);
      });
    });

    it('should persist cart to localStorage on clear', async () => {
      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      act(() => {
        result.current.clearCart();
      });

      await waitFor(() => {
        const savedCart = JSON.parse(
          localStorage.getItem(CART_STORAGE_KEY) || '[]'
        );
        expect(savedCart).toHaveLength(0);
      });
    });

    it('should restore cart from localStorage on new instance', async () => {
      const initialData: CartItem[] = [
        { id: 1, title: 'Product 1', price: 50, quantity: 2 },
        { id: 2, title: 'Product 2', price: 75, quantity: 1 },
      ];

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialData));

      const { result } = renderHook(() => useCartStore(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toEqual(initialData);
      expect(result.current.totalPrice).toBe(175);
    });
  });

  describe('Authentication Handling', () => {
    it('should clear items when user logs out', async () => {
      const { result, rerender } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      expect(result.current.items).toHaveLength(1);

      mockAuthState = {
        ...mockAuthState,
        user: null as unknown as AuthUser,
        isAuthenticated: false,
      };
      
      rerender();

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0);
      });
    });

    it('should not save to storage when unauthenticated', async () => {
      mockAuthState = {
        ...mockAuthState,
        user: null as unknown as AuthUser,
        isAuthenticated: false,
      };

      const { result } = renderHook(() => useCartStore(), { wrapper });

      act(() => {
        result.current.addItem({ id: 1, title: 'Product 1', price: 50 });
      });

      await waitFor(() => {
        expect(localStorage.getItem(CART_STORAGE_KEY)).toBeNull();
      });
    });
  });
});
