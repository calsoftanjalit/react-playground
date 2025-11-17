import { ORDER_CONSTANTS } from '@/constants/checkout';
import { CartItem } from '@/types/cart';
import { PricingBreakdown } from '@/types/checkout';

export const calculatePricing = (
  items: CartItem[],
  discountAmount: number = 0
): PricingBreakdown => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping =
    subtotal > ORDER_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : ORDER_CONSTANTS.SHIPPING_COST;
  const tax = subtotal * ORDER_CONSTANTS.TAX_RATE;
  const total = subtotal + shipping + tax - discountAmount;

  return {
    subtotal,
    shipping,
    tax,
    discount: discountAmount > 0 ? discountAmount : undefined,
    total,
  };
};

export const calculatePricingFromItems = (
  items: Array<{ price: number; quantity: number }>,
  discountAmount: number = 0
): PricingBreakdown => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping =
    subtotal > ORDER_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : ORDER_CONSTANTS.SHIPPING_COST;
  const tax = subtotal * ORDER_CONSTANTS.TAX_RATE;
  const total = subtotal + shipping + tax - discountAmount;

  return {
    subtotal,
    shipping,
    tax,
    discount: discountAmount > 0 ? discountAmount : undefined,
    total,
  };
};

export const recalculatePricing = (
  items: CartItem[],
  currentDiscount: number = 0
): PricingBreakdown => {
  return calculatePricing(items, currentDiscount);
};
