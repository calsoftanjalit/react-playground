import { ProductInterface } from '@/types/product';
import { WishlistItem, WishlistProviderProps } from '@/types/wishlist';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { WishlistContext } from './WishlistContext';

export const WishlistProvider: FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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
