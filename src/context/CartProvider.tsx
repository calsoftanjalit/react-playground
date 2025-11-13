import React, { useCallback, useEffect, useState, useMemo } from "react";

import { CartContext } from "./CartContext";

import { CART_STORAGE_KEY } from "@/constants/cart";

import type {
  CartContextType,
  CartItem,
  CartProviderProps,
} from "@/types/cart";

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isLoading]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
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
        return prevItems.filter((i) => i.id !== id);
      }

      return prevItems.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isLoading,
    }),
    [
      items,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isLoading,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
