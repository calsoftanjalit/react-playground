import { CheckoutCart } from '@/types/checkout';
import { recalculatePricing } from '@/utils';
import { useEffect, useState } from 'react';

interface UseOrderSummaryCardProps {
  cart: CheckoutCart;
  onCartUpdate?: (updatedCart: CheckoutCart) => void;
}

export const useOrderSummaryCard = ({ cart, onCartUpdate }: UseOrderSummaryCardProps) => {
  const [localCart, setLocalCart] = useState(cart);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const itemCount = localCart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedItems = localCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const updatedPricing = recalculatePricing(updatedItems, localCart.pricing.discount || 0);

    const updatedCart: CheckoutCart = {
      items: updatedItems,
      pricing: updatedPricing,
    };

    setLocalCart(updatedCart);
    if (onCartUpdate) {
      onCartUpdate(updatedCart);
    }
  };

  return {
    localCart,
    itemCount,
    handleQuantityChange,
  };
};
