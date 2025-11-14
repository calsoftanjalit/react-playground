import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import type { CartContextType } from '@/types/cart';

export const useCartStore = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCartStore must be used within a CartProvider');
  }

  return context;
};
