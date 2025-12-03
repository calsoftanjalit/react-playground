// hooks/useRecentlyViewed.ts
import { useCallback } from 'react';
import { ProductInterface } from '@/types';
import { RECENTLY_VIEWED } from '@/constants';

export const useRecentlyViewed = (limit: number = 5) => {
  const getItems = useCallback((): ProductInterface[] => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const addItem = useCallback(
    (product: ProductInterface): void => {
      const items = getItems();

      // Remove duplicate if exists
      const filtered = items.filter((p) => p.id !== product.id);

      // Prepend new product
      const updated = [product, ...filtered].slice(0, limit);

      try {
        localStorage.setItem(RECENTLY_VIEWED, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recently viewed items', e);
      }
    },
    [getItems, limit]
  );

  const clear = useCallback(() => {
    localStorage.removeItem(RECENTLY_VIEWED);
  }, []);

  return {
    getItems,
    addItem,
    clear,
  };
};
