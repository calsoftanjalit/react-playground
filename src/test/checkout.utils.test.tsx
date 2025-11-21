import { ORDER_CONSTANTS } from '@/constants/checkout';
import { calculatePricing, calculatePricingFromItems } from '@/utils/checkout';
import { describe, expect, it } from 'vitest';

describe('checkout utils', () => {
  describe('calculatePricing', () => {
    it('calculates correct pricing for basic cart', () => {
      const items = [
        { id: 1, title: 'Item 1', price: 50, quantity: 2, thumbnail: '' },
        { id: 2, title: 'Item 2', price: 30, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe(130);
      expect(result.shipping).toBe(ORDER_CONSTANTS.SHIPPING_COST);
      expect(result.tax).toBe(130 * ORDER_CONSTANTS.TAX_RATE);
      expect(result.total).toBe(130 + ORDER_CONSTANTS.SHIPPING_COST + (130 * ORDER_CONSTANTS.TAX_RATE));
    });

    it('applies free shipping when subtotal exceeds threshold', () => {
      const items = [
        { id: 1, title: 'Item', price: 600, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe(600);
      expect(result.shipping).toBe(0);
    });

    it('applies discount correctly', () => {
      const items = [
        { id: 1, title: 'Item', price: 100, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items, 20);

      expect(result.discount).toBe(20);
      expect(result.total).toBe(100 + ORDER_CONSTANTS.SHIPPING_COST + (100 * ORDER_CONSTANTS.TAX_RATE) - 20);
    });

    it('handles zero discount', () => {
      const items = [
        { id: 1, title: 'Item', price: 50, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items, 0);

      expect(result.discount).toBeUndefined();
    });

    it('handles empty cart', () => {
      const result = calculatePricing([]);

      expect(result.subtotal).toBe(0);
      expect(result.shipping).toBe(ORDER_CONSTANTS.SHIPPING_COST);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(ORDER_CONSTANTS.SHIPPING_COST);
    });

    it('calculates tax with correct rate', () => {
      const items = [
        { id: 1, title: 'Item', price: 100, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.tax).toBe(100 * 0.09);
    });

    it('applies free shipping at exact threshold', () => {
      const items = [
        { id: 1, title: 'Item', price: 100, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.shipping).toBe(ORDER_CONSTANTS.SHIPPING_COST);
    });

    it('charges shipping below threshold', () => {
      const items = [
        { id: 1, title: 'Item', price: 99, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.shipping).toBe(10);
    });
  });

  describe('calculatePricingFromItems', () => {
    it('calculates pricing from simple item array', () => {
      const items = [
        { price: 50, quantity: 2 },
        { price: 30, quantity: 1 },
      ];

      const result = calculatePricingFromItems(items);

      expect(result.subtotal).toBe(130);
      expect(result.tax).toBe(130 * ORDER_CONSTANTS.TAX_RATE);
    });

    it('applies free shipping correctly', () => {
      const items = [
        { price: 600, quantity: 1 },
      ];

      const result = calculatePricingFromItems(items);

      expect(result.shipping).toBe(0);
    });

    it('handles discount', () => {
      const items = [
        { price: 100, quantity: 1 },
      ];

      const result = calculatePricingFromItems(items, 15);

      expect(result.discount).toBe(15);
      expect(result.total).toBe(100 + ORDER_CONSTANTS.SHIPPING_COST + (100 * ORDER_CONSTANTS.TAX_RATE) - 15);
    });

    it('handles empty items array', () => {
      const result = calculatePricingFromItems([]);

      expect(result.subtotal).toBe(0);
      expect(result.shipping).toBe(ORDER_CONSTANTS.SHIPPING_COST);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(ORDER_CONSTANTS.SHIPPING_COST);
    });

    it('handles zero discount', () => {
      const items = [
        { price: 50, quantity: 1 },
      ];

      const result = calculatePricingFromItems(items, 0);

      expect(result.discount).toBeUndefined();
    });

    it('calculates with multiple quantities', () => {
      const items = [
        { price: 25.50, quantity: 3 },
        { price: 10.99, quantity: 5 },
      ];

      const result = calculatePricingFromItems(items);

      const expectedSubtotal = (25.50 * 3) + (10.99 * 5);
      expect(result.subtotal).toBeCloseTo(expectedSubtotal, 2);
    });

    it('handles decimal prices', () => {
      const items = [
        { price: 19.99, quantity: 2 },
      ];

      const result = calculatePricingFromItems(items);

      expect(result.subtotal).toBeCloseTo(39.98, 2);
    });
  });

  describe('Edge Cases', () => {
    it('handles very large quantities', () => {
      const items = [
        { id: 1, title: 'Item', price: 1, quantity: 1000, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe(1000);
      expect(result.shipping).toBe(0);
    });

    it('handles very small prices', () => {
      const items = [
        { id: 1, title: 'Item', price: 0.01, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe(0.01);
      expect(result.total).toBeCloseTo(0.01 + 10 + (0.01 * 0.09), 2);
    });

    it('handles large discount that exceeds subtotal', () => {
      const items = [
        { id: 1, title: 'Item', price: 50, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items, 100);

      expect(result.discount).toBe(100);
      expect(result.total).toBeLessThan(result.subtotal);
    });

    it('uses discountedPrice when available instead of price', () => {
      const items = [
        { id: 1, title: 'Item', price: 100, discountedPrice: 300, quantity: 2, thumbnail: '' },
        { id: 2, title: 'Item 2', price: 50, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe((300 * 2) + 50);
      expect(result.shipping).toBe(0);
      expect(result.tax).toBe(650 * ORDER_CONSTANTS.TAX_RATE);
      expect(result.total).toBe(650 + 0 + (650 * ORDER_CONSTANTS.TAX_RATE));
    });

    it('falls back to price when discountedPrice is not provided', () => {
      const items = [
        { id: 1, title: 'Item', price: 100, quantity: 1, thumbnail: '' },
      ];

      const result = calculatePricing(items);

      expect(result.subtotal).toBe(100);
      expect(result.total).toBe(100 + ORDER_CONSTANTS.SHIPPING_COST + (100 * ORDER_CONSTANTS.TAX_RATE));
    });
  });
});
