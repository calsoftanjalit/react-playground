export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  discount?: number;
  coupon?: Coupon;
}
