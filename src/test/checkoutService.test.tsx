import { generateOrderSummary, submitOrder } from '@/services/checkoutService';
import { CartItem } from '@/types/cart';
import { CheckoutFormValues } from '@/types/checkout';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('checkoutService', () => {
  let mockFormValues: CheckoutFormValues;
  let mockCartItems: CartItem[];
  let mockTotalPrice: number;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFormValues = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-0123',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      cardNumber: '4242424242424242',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
    };

    mockCartItems = [
      {
        id: 1,
        title: 'Product 1',
        price: 99.99,
        quantity: 2,
        thumbnail: 'https://example.com/product1.jpg',
      },
      {
        id: 2,
        title: 'Product 2',
        price: 49.99,
        quantity: 1,
        thumbnail: 'https://example.com/product2.jpg',
      },
    ];

    mockTotalPrice = 249.97;
  });

  describe('generateOrderSummary', () => {
    it('generates order summary with correct structure', () => {
      const orderSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );

      expect(orderSummary).toBeDefined();
      expect(orderSummary.orderId).toBeDefined();
      expect(orderSummary.fullName).toBe(mockFormValues.fullName);
      expect(orderSummary.email).toBe(mockFormValues.email);
      expect(orderSummary.address).toBeDefined();
      expect(orderSummary.totalAmount).toBe(mockTotalPrice);
      expect(orderSummary.orderDate).toBeDefined();
      expect(orderSummary.items).toHaveLength(2);
    });

    it('generates unique order IDs', () => {
      const summary1 = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );
      const summary2 = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );

      expect(summary1.orderId).not.toBe(summary2.orderId);
    });

    it('formats full address correctly', () => {
      const orderSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );

      expect(orderSummary.address).toContain(mockFormValues.address);
      expect(orderSummary.address).toContain(mockFormValues.city);
      expect(orderSummary.address).toContain(mockFormValues.state);
      expect(orderSummary.address).toContain(mockFormValues.zipCode);
      expect(orderSummary.address).toContain(mockFormValues.country);
    });

    it('uses provided totalPrice instead of recalculating', () => {
      const customTotalPrice = 999.99;
      const orderSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        customTotalPrice
      );

      expect(orderSummary.totalAmount).toBe(customTotalPrice);
    });

    it('maps cart items to order items correctly', () => {
      const orderSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );

      expect(orderSummary.items).toHaveLength(mockCartItems.length);
      
      orderSummary.items.forEach((item, index) => {
        const cartItem = mockCartItems[index]!;
        expect(item.id).toBe(cartItem.id);
        expect(item.name).toBe(cartItem.title);
        expect(item.quantity).toBe(cartItem.quantity);
        expect(item.price).toBe(cartItem.price);
        expect(item.image).toBe(cartItem.thumbnail);
      });
    });

    it('handles items without thumbnails', () => {
      const itemsWithoutThumbnails: CartItem[] = [
        {
          id: 1,
          title: 'Product Without Image',
          price: 25.00,
          quantity: 1,
        },
      ];

      const orderSummary = generateOrderSummary(
        mockFormValues,
        itemsWithoutThumbnails,
        25.00
      );

      expect(orderSummary.items[0]?.image).toBe('');
    });

    it('formats order date correctly', () => {
      const orderSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );

      expect(orderSummary.orderDate).toBeDefined();
      expect(typeof orderSummary.orderDate).toBe('string');
      expect(orderSummary.orderDate.length).toBeGreaterThan(0);
    });

    it('handles empty cart items', () => {
      const orderSummary = generateOrderSummary(
        mockFormValues,
        [],
        0
      );

      expect(orderSummary.items).toHaveLength(0);
      expect(orderSummary.totalAmount).toBe(0);
    });

    it('handles single item cart', () => {
      const singleItem = [mockCartItems[0]!];
      const orderSummary = generateOrderSummary(
        mockFormValues,
        singleItem,
        199.98
      );

      expect(orderSummary.items).toHaveLength(1);
      expect(orderSummary.items[0]?.name).toBe(singleItem[0].title);
    });

    it('handles large quantities', () => {
      const largeQuantityItems: CartItem[] = [
        {
          id: 1,
          title: 'Bulk Product',
          price: 5.00,
          quantity: 1000,
          thumbnail: 'https://example.com/bulk.jpg',
        },
      ];

      const orderSummary = generateOrderSummary(
        mockFormValues,
        largeQuantityItems,
        5000.00
      );

      expect(orderSummary.items[0]?.quantity).toBe(1000);
      expect(orderSummary.totalAmount).toBe(5000.00);
    });
  });

  describe('submitOrder', () => {
    it('resolves with order summary after delay', async () => {
      const orderSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        100
      );

      expect(orderSummary).toBeDefined();
      expect(orderSummary.fullName).toBe(mockFormValues.fullName);
      expect(orderSummary.email).toBe(mockFormValues.email);
      expect(orderSummary.totalAmount).toBe(mockTotalPrice);
    });

    it('uses default delay of 1500ms when not specified', async () => {
      const startTime = Date.now();
      await submitOrder(mockFormValues, mockCartItems, mockTotalPrice);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(1500);
      expect(endTime - startTime).toBeLessThan(1600);
    });

    it('uses custom delay when provided', async () => {
      const customDelay = 500;
      const startTime = Date.now();
      await submitOrder(mockFormValues, mockCartItems, mockTotalPrice, customDelay);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(customDelay);
      expect(endTime - startTime).toBeLessThan(customDelay + 100);
    });

    it('generates order summary with correct data', async () => {
      const orderSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        100
      );

      expect(orderSummary.orderId).toBeDefined();
      expect(orderSummary.items).toHaveLength(mockCartItems.length);
      expect(orderSummary.totalAmount).toBe(mockTotalPrice);
    });

    it('handles empty cart submission', async () => {
      const orderSummary = await submitOrder(
        mockFormValues,
        [],
        0,
        100
      );

      expect(orderSummary.items).toHaveLength(0);
      expect(orderSummary.totalAmount).toBe(0);
    });

    it('uses provided totalPrice parameter', async () => {
      const customTotal = 1234.56;
      const orderSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        customTotal,
        100
      );

      expect(orderSummary.totalAmount).toBe(customTotal);
    });

    it('returns promise that resolves', async () => {
      const promise = submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        100
      );

      expect(promise).toBeInstanceOf(Promise);
      await expect(promise).resolves.toBeDefined();
    });

    it('generates different order IDs for multiple submissions', async () => {
      const order1 = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        50
      );
      const order2 = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        50
      );

      expect(order1.orderId).not.toBe(order2.orderId);
    });

    it('handles zero delay', async () => {
      const startTime = Date.now();
      const orderSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        0
      );
      const endTime = Date.now();

      expect(orderSummary).toBeDefined();
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Integration', () => {
    it('submitOrder and generateOrderSummary produce consistent results', async () => {
      const generatedSummary = generateOrderSummary(
        mockFormValues,
        mockCartItems,
        mockTotalPrice
      );
      const submittedSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        50
      );

      expect(submittedSummary.fullName).toBe(generatedSummary.fullName);
      expect(submittedSummary.email).toBe(generatedSummary.email);
      expect(submittedSummary.totalAmount).toBe(generatedSummary.totalAmount);
      expect(submittedSummary.items.length).toBe(generatedSummary.items.length);
    });

    it('maintains data integrity through submission process', async () => {
      const orderSummary = await submitOrder(
        mockFormValues,
        mockCartItems,
        mockTotalPrice,
        100
      );

      expect(orderSummary.fullName).toBe(mockFormValues.fullName);
      expect(orderSummary.email).toBe(mockFormValues.email);
      expect(orderSummary.totalAmount).toBe(mockTotalPrice);
      expect(orderSummary.items[0]?.name).toBe(mockCartItems[0]!.title);
      expect(orderSummary.items[0]?.quantity).toBe(mockCartItems[0]!.quantity);
      expect(orderSummary.items[0]?.price).toBe(mockCartItems[0]!.price);
    });
  });
});
