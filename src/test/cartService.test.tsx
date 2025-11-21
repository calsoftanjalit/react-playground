import apiClient from '@/services/apis/apiClient';
import { addCart } from '@/services/cartService';
import { AddCartBodyInterface, CartInterface } from '@/types/cart';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/apis/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addCart', () => {
    it('should add a cart item successfully', async () => {
      const mockCartBody: AddCartBodyInterface = {
        userId: 1,
        products: [
          {
            id: 1,
            quantity: 2,
          },
        ],
      };

      const mockResponse: CartInterface = {
        id: 1,
        products: [
          {
            id: 1,
            title: 'Test Product',
            price: 100,
            quantity: 2,
            total: 200,
            discountedPrice: 180,
            thumbnail: 'https://example.com/image.jpg',
          },
        ],
        total: 200,
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockResponse,
      });

      const result = await addCart(mockCartBody);

      expect(apiClient.post).toHaveBeenCalledWith('carts/add', mockCartBody);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBe(1);
      expect(result.products).toHaveLength(1);
    });

    it('should handle API errors', async () => {
      const mockCartBody: AddCartBodyInterface = {
        userId: 1,
        products: [{ id: 1, quantity: 1 }],
      };

      const mockError = new Error('API Error');
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(addCart(mockCartBody)).rejects.toThrow('API Error');
      expect(apiClient.post).toHaveBeenCalledWith('carts/add', mockCartBody);
    });

    it('should pass correct endpoint to apiClient', async () => {
      const mockCartBody: AddCartBodyInterface = {
        userId: 2,
        products: [{ id: 3, quantity: 5 }],
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {} as CartInterface,
      });

      await addCart(mockCartBody);

      expect(apiClient.post).toHaveBeenCalledWith('carts/add', mockCartBody);
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    it('should return the data from the API response', async () => {
      const mockCartBody: AddCartBodyInterface = {
        userId: 3,
        products: [{ id: 5, quantity: 3 }],
      };

      const mockCartResponse: CartInterface = {
        id: 123,
        products: [],
        total: 150,
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockCartResponse,
      });

      const result = await addCart(mockCartBody);

      expect(result).toBe(mockCartResponse);
      expect(result.id).toBe(123);
      expect(result.total).toBe(150);
    });
  });
});
