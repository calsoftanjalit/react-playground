import { calculateDiscountedPrice } from '@/utils/calculateDiscountedPrice';
import { describe, expect, it } from 'vitest';

describe('calculateDiscountedPrice', () => {
  it('should calculate discounted price correctly', () => {
    const price = 100;
    const percentage = 10;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(90);
  });

  it('should calculate discounted price with decimal result', () => {
    const price = 99.99;
    const percentage = 15;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(84.99);
  });

  it('should handle zero discount percentage', () => {
    const price = 50;
    const percentage = 0;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(50);
  });

  it('should handle 100% discount', () => {
    const price = 200;
    const percentage = 100;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(0);
  });

  it('should return 0 when price is NaN', () => {
    const price = Number.NaN;
    const percentage = 10;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(0);
  });

  it('should return 0 when percentage is NaN', () => {
    const price = 100;
    const percentage = Number.NaN;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(0);
  });

  it('should return 0 when both price and percentage are NaN', () => {
    const price = Number.NaN;
    const percentage = Number.NaN;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(0);
  });

  it('should handle large numbers', () => {
    const price = 10000;
    const percentage = 25;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(7500);
  });

  it('should handle small percentage values', () => {
    const price = 1000;
    const percentage = 0.5;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(995);
  });

  it('should round to 2 decimal places', () => {
    const price = 99.99;
    const percentage = 33.33;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(66.66);
  });

  it('should handle negative price (edge case)', () => {
    const price = -100;
    const percentage = 10;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(-90);
  });

  it('should handle zero price', () => {
    const price = 0;
    const percentage = 10;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(0);
  });

  it('should handle fractional prices', () => {
    const price = 19.95;
    const percentage = 20;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(15.96);
  });

  it('should handle very high discount percentages', () => {
    const price = 500;
    const percentage = 150;
    const result = calculateDiscountedPrice(price, percentage);

    expect(result).toBe(-250);
  });
});
