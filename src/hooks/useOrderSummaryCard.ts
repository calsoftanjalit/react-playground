import { CheckoutCart } from '@/types/checkout';
import { recalculatePricing } from '@/utils';
import { useEffect, useState } from 'react';
import { Coupon, CouponValidationResult } from '@/types';
import { PREDEFINED_COUPONS } from '@/utils/predefinedCoupons';
interface UseOrderSummaryCardProps {
  cart: CheckoutCart;
  onCartUpdate?: (updatedCart: CheckoutCart) => void;
}

export const useOrderSummaryCard = ({ cart, onCartUpdate }: UseOrderSummaryCardProps) => {
  const [localCart, setLocalCart] = useState(cart);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (appliedCoupon) {
      const discount = calculateDiscount(appliedCoupon, cart.pricing.subtotal);
      const updatedPricing = recalculatePricing(cart.items, discount);
      setLocalCart({
        items: cart.items,
        pricing: updatedPricing,
      });
    } else {
      setLocalCart(cart);
    }
  }, [cart, appliedCoupon]);

  const itemCount = localCart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedItems = localCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const currentDiscount = appliedCoupon
      ? calculateDiscount(appliedCoupon, localCart.pricing.subtotal)
      : 0;
    const updatedPricing = recalculatePricing(updatedItems, currentDiscount);

    const updatedCart: CheckoutCart = {
      items: updatedItems,
      pricing: updatedPricing,
    };

    setLocalCart(updatedCart);
    if (onCartUpdate) {
      onCartUpdate(updatedCart);
    }
  };
  const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return coupon.discountValue;
  };

  const validateCoupon = (code: string): CouponValidationResult => {
    const trimmedCode = code.trim().toUpperCase();

    // Check if coupon exists
    const coupon = PREDEFINED_COUPONS[trimmedCode];
    if (!coupon) {
      return {
        isValid: false,
        message: 'Invalid coupon code. Please check and try again.',
      };
    }

    // Check if already applied
    if (appliedCoupon?.code === trimmedCode) {
      return {
        isValid: false,
        message: 'This coupon is already applied.',
      };
    }

    // Check expiry date
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (today > expiryDate) {
      return {
        isValid: false,
        message: 'This coupon has expired.',
      };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        message: 'This coupon has reached its usage limit.',
      };
    }

    // Check minimum purchase
    if (localCart.pricing.subtotal < coupon.minPurchase) {
      return {
        isValid: false,
        message: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required for this coupon.`,
      };
    }

    // Calculate discount
    const discount = calculateDiscount(coupon, localCart.pricing.subtotal);

    return {
      isValid: true,
      message: `Coupon applied successfully! You saved $${discount.toFixed(2)}`,
      discount,
      coupon,
    };
  };

  const applyCoupon = (code: string): CouponValidationResult => {
    const result = validateCoupon(code);

    if (result.isValid && result.coupon && result.discount !== undefined) {
      setAppliedCoupon(result.coupon);

      const updatedPricing = recalculatePricing(localCart.items, result.discount);

      const updatedCart: CheckoutCart = {
        items: localCart.items,
        pricing: updatedPricing,
      };

      setLocalCart(updatedCart);
      if (onCartUpdate) {
        onCartUpdate(updatedCart);
      }
    }

    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);

    const updatedPricing = recalculatePricing(localCart.items, 0);

    const updatedCart: CheckoutCart = {
      items: localCart.items,
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
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  };
};
