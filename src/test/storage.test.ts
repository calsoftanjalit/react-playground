import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
  clearStorage,
} from '@/utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setInStorage', () => {
    it('should set a string value', () => {
      const key = 'test_key';
      const value = 'test_value';

      const result = setInStorage(key, value);

      expect(result).toBe(true);
      expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should set an object value', () => {
      const key = 'user';
      const value = { id: 1, name: 'John', email: 'john@example.com' };

      const result = setInStorage(key, value);

      expect(result).toBe(true);
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      expect(stored).toEqual(value);
    });

    it('should set an array value', () => {
      const key = 'items';
      const value = [
        { id: 1, name: 'Item 1', price: 10 },
        { id: 2, name: 'Item 2', price: 20 },
      ];

      const result = setInStorage(key, value);

      expect(result).toBe(true);
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      expect(stored).toEqual(value);
    });

    it('should set a number value', () => {
      const key = 'count';
      const value = 42;

      const result = setInStorage(key, value);

      expect(result).toBe(true);
      expect(JSON.parse(localStorage.getItem(key) || '0')).toBe(value);
    });

    it('should set a boolean value', () => {
      const key = 'flag';
      const value = true;

      const result = setInStorage(key, value);

      expect(result).toBe(true);
      expect(JSON.parse(localStorage.getItem(key) || 'false')).toBe(value);
    });

    it('should overwrite existing value', () => {
      const key = 'test';

      setInStorage(key, 'old_value');
      const result = setInStorage(key, 'new_value');

      expect(result).toBe(true);
      expect(JSON.parse(localStorage.getItem(key) || '')).toBe('new_value');
    });
  });

  describe('getFromStorage', () => {
    it('should get a string value', () => {
      const key = 'test_key';
      const value = 'test_value';
      localStorage.setItem(key, JSON.stringify(value));

      const result = getFromStorage<string>(key);

      expect(result).toBe(value);
    });

    it('should get an object value with correct type', () => {
      const key = 'user';
      const value = { id: 1, name: 'John', email: 'john@example.com' };
      localStorage.setItem(key, JSON.stringify(value));

      const result = getFromStorage<typeof value>(key);

      expect(result).toEqual(value);
      expect(result?.id).toBe(1);
    });

    it('should get an array value with correct type', () => {
      const key = 'items';
      const value = [{ id: 1, name: 'Item' }];
      localStorage.setItem(key, JSON.stringify(value));

      const result = getFromStorage<typeof value>(key);

      expect(result).toEqual(value);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return null for non-existent key', () => {
      const result = getFromStorage('non_existent_key');

      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      const key = 'invalid';
      localStorage.setItem(key, '{invalid json}');

      const result = getFromStorage(key);

      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const key = 'empty';
      localStorage.setItem(key, '');

      const result = getFromStorage(key);

      expect(result).toBeNull();
    });
  });

  describe('removeFromStorage', () => {
    it('should remove a stored value', () => {
      const key = 'test_key';
      setInStorage(key, 'value');

      const result = removeFromStorage(key);

      expect(result).toBe(true);
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('should return true even if key does not exist', () => {
      const result = removeFromStorage('non_existent');

      expect(result).toBe(true);
    });

    it('should remove only the specified key', () => {
      setInStorage('key1', 'value1');
      setInStorage('key2', 'value2');

      removeFromStorage('key1');

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).not.toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('should clear all storage items', () => {
      setInStorage('key1', 'value1');
      setInStorage('key2', 'value2');
      setInStorage('key3', 'value3');

      const result = clearStorage();

      expect(result).toBe(true);
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('key3')).toBeNull();
    });

    it('should handle clearing empty storage', () => {
      const result = clearStorage();

      expect(result).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety with generics for complex objects', () => {
      interface User {
        id: number;
        name: string;
        active: boolean;
      }

      const key = 'user';
      const user: User = { id: 1, name: 'Alice', active: true };

      setInStorage(key, user);
      const retrieved = getFromStorage<User>(key);

      expect(retrieved?.id).toBe(1);
      expect(retrieved?.name).toBe('Alice');
      expect(retrieved?.active).toBe(true);
    });

    it('should handle array of typed objects', () => {
      interface CartItem {
        id: number;
        title: string;
        price: number;
        quantity: number;
      }

      const key = 'cart';
      const items: CartItem[] = [
        { id: 1, title: 'Product 1', price: 10, quantity: 2 },
        { id: 2, title: 'Product 2', price: 20, quantity: 1 },
      ];

      setInStorage(key, items);
      const retrieved = getFromStorage<CartItem[]>(key);

      expect(retrieved).toHaveLength(2);
      expect(retrieved?.[0].title).toBe('Product 1');
      expect(retrieved?.[1].price).toBe(20);
    });
  });

  describe('Integration with CartProvider', () => {
    it('should store and retrieve cart items', () => {
      interface CartItem {
        id: number;
        title: string;
        price: number;
        quantity: number;
      }

      const CART_KEY = 'cart_items';
      const cartItems: CartItem[] = [
        { id: 1, title: 'Item 1', price: 50, quantity: 2 },
        { id: 2, title: 'Item 2', price: 75, quantity: 1 },
      ];

      // Simulate CartProvider saving
      setInStorage(CART_KEY, cartItems);

      // Simulate CartProvider loading
      const loaded = getFromStorage<CartItem[]>(CART_KEY);

      expect(loaded).toEqual(cartItems);
      expect(loaded?.[0].quantity).toBe(2);
      expect(loaded?.reduce((sum, item) => sum + item.quantity, 0)).toBe(3);
    });
  });
});
