import { Coupon } from '@/types/coupon';
export const PREDEFINED_COUPONS: Record<string, Coupon> = {
  SAVE20: {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 50,
    expiryDate: '2025-12-31',
    usageLimit: 100,
    usedCount: 45,
  },
  FLAT10: {
    code: 'FLAT10',
    discountType: 'fixed',
    discountValue: 10,
    minPurchase: 30,
    expiryDate: '2025-12-31',
  },
  WELCOME15: {
    code: 'WELCOME15',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 0,
    expiryDate: '2025-12-31',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 5,
    minPurchase: 25,
    expiryDate: '2025-12-31',
  },
};
