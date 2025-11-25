import { useContext } from 'react';
import { WishlistContext } from '@/context/WishlistContext';
import { WishlistContextType } from '@/types/wishlist';

export const useWishlistStore = (): WishlistContextType => {
  const context = useContext(WishlistContext);

  if (context === undefined) {
    throw new Error('useWishlistStore must be used within a WishlistProvider');
  }

  return context;
};
