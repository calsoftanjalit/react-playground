import { useCallback, useEffect, useState, useMemo } from 'react';
import type { CartContextType, CartItem, CartProviderProps } from '@/types/cart';
import { CartContext } from '@/context/CartContext';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getUserCartKey } from '@/constants/cart';
import { getFromStorage, setInStorage } from '@/utils/storage';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsLoading(true);
    
    if (isAuthenticated && user) {
      const userCartKey = getUserCartKey(user.id);
      const savedCart = getFromStorage<CartItem[]>(userCartKey);
      setItems(savedCart || []);
    } else {
      setItems([]);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const userCartKey = getUserCartKey(user.id);
      setInStorage(userCartKey, items);
    }
  }, [items, isLoading, user, isAuthenticated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      // Add new item with quantity 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const updateItem = useCallback((id: number, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        // remove Item if quantity is zero or less
        return prevItems.filter((cartItem) => cartItem.id !== id);
      }

      return prevItems.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity } : cartItem
      );
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((cartItem) => cartItem.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) => total + (item.discountedPrice || item.price ) * item.quantity,
      0
    );
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      totalPrice,
      totalItems,
      isLoading,
    }),
    [
      items,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      totalPrice,
      totalItems,
      isLoading,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
