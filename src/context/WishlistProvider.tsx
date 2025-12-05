import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { notifications } from '@mantine/notifications';
import type { ProductInterface } from '@/types/product';
import type { WishlistItem, WishlistProviderProps } from '@/types/wishlist';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getUserWishlistKey } from '@/constants/cart';
import { WishlistContext } from '@/context/WishlistContext';

export const WishlistProvider: FC<WishlistProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userWishlistKey = getUserWishlistKey(user.id);
      const savedWishlist = localStorage.getItem(userWishlistKey);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } else {
      setWishlist([]);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userWishlistKey = getUserWishlistKey(user.id);
      localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, user, isAuthenticated]);

  const addToWishlist = useCallback((product: ProductInterface) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      notifications.show({
        title: 'Added to Wishlist',
        message: `${product.title} has been added to your wishlist`,
        color: 'green',
      });
      return [...prev, { ...product, addedAt: Date.now() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      const itemToRemove = prev.find((item) => item.id === productId);
      if (itemToRemove) {
        notifications.show({
          title: 'Removed from Wishlist',
          message: `${itemToRemove.title} has been removed from your wishlist`,
          color: 'red',
        });
      }
      return prev.filter((item) => item.id !== productId);
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
