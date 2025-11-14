import { CartProductInterface } from '@/types/cart';
import { useCallback, useMemo, useState } from 'react';

const dummyCartData: CartProductInterface[] = [
  {
    id: 1,
    title: 'Eyeshadow Palette with Mirror',
    price: 12.01,
    quantity: 2,
    total: 12.01 * 2,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    id: 2,
    title: 'Nitrogen Skincare Cream',
    price: 14.0,
    quantity: 1,
    total: 14.0 * 1,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    id: 3,
    title: 'Yttrium Serum',
    price: 88.91,
    quantity: 3,
    total: 88.91 * 3,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    id: 4,
    title: 'Barium Hair Oil',
    price: 137.33,
    quantity: 1,
    total: 137.33 * 1,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    id: 5,
    title: 'Cerium Face Cream',
    price: 140.12,
    quantity: 2,
    total: 140.12 * 2,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
];

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartProductInterface[]>(dummyCartData);

  const total: string = useMemo(() => {
    return cartItems.reduce((acc, el) => acc + el.price * el.quantity, 0).toFixed(2);
  }, [cartItems]);

  const handleQuantityChange = useCallback((id: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, quantity: newQuantity, total: el.price * newQuantity } : el
      )
    );
  }, []);

  const handleRemoveItem = (id: number) => {
    const filterItem = cartItems.filter((ele) => ele.id !== id);
    setCartItems(filterItem);
  };

  return {
    cartItems,
    handleQuantityChange,
    total,
    handleRemoveItem,
  };
};
