import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder, getUserOrders, getOrderById, clearUserOrders } from '@/services/orderService';
import { getFromStorage, setInStorage } from '@/utils/storage';

vi.mock('@/utils/storage', () => ({
  getFromStorage: vi.fn(),
  setInStorage: vi.fn(),
}));

describe('orderService', () => {
  const mockOrders = [
    {
      id: 'ORD-1',
      userId: 1,
      date: '2024-01-01T00:00:00.000Z',
      total: 100,
      status: 'delivered',
      items: [],
    },
    {
      id: 'ORD-2',
      userId: 1,
      date: '2024-01-02T00:00:00.000Z',
      total: 200,
      status: 'delivered',
      items: [],
    },
    {
      id: 'ORD-3',
      userId: 2,
      date: '2024-01-03T00:00:00.000Z',
      total: 300,
      status: 'delivered',
      items: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFromStorage).mockReturnValue(mockOrders);
  });

  describe('getUserOrders', () => {
    it('should return orders for specific user', () => {
      const orders = getUserOrders(1);
      expect(orders).toHaveLength(2);
      expect(orders.map(o => o.id)).toEqual(['ORD-1', 'ORD-2']);
    });

    it('should return empty array if no orders found for user', () => {
      const orders = getUserOrders(3);
      expect(orders).toHaveLength(0);
    });

    it('should return empty array if storage is empty', () => {
      vi.mocked(getFromStorage).mockReturnValue(null);
      const orders = getUserOrders(1);
      expect(orders).toHaveLength(0);
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', () => {
      const order = getOrderById('ORD-1');
      expect(order).toBeDefined();
      expect(order?.id).toBe('ORD-1');
    });

    it('should return undefined if order not found', () => {
      const order = getOrderById('NON-EXISTENT');
      expect(order).toBeUndefined();
    });
  });

  describe('createOrder', () => {
    it('should create new order and save to storage', () => {
      const request = {
        userId: 1,
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 50,
            quantity: 2,
            thumbnail: 'img.jpg',
          },
        ],
        total: 100,
      };

      const newOrder = createOrder(request);

      expect(newOrder).toBeDefined();
      expect(newOrder.userId).toBe(1);
      expect(newOrder.total).toBe(100);
      expect(newOrder.items).toHaveLength(1);
      expect(newOrder.id).toContain('ORD-');

      expect(setInStorage).toHaveBeenCalledTimes(1);
      const savedOrders = vi.mocked(setInStorage).mock.calls[0][1] as unknown[];
      expect(savedOrders).toHaveLength(4);
      expect((savedOrders[3] as { id: string }).id).toBe(newOrder.id);
    });
  });

  describe('clearUserOrders', () => {
    it('should remove all orders for a specific user', () => {
      clearUserOrders(1);

      expect(setInStorage).toHaveBeenCalledTimes(1);
      const savedOrders = vi.mocked(setInStorage).mock.calls[0][1] as { userId: number }[];
      expect(savedOrders).toHaveLength(1);
      expect(savedOrders[0].userId).toBe(2);
    });
  });
});
