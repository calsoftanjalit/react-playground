import apiClient from '@/services/apis/apiClient';
import { fetchProductById, fetchProducts } from '@/services/productService';
import { ProductApiInterface } from '@/types/product';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/apis/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch products with the correct limit', async () => {
      const mockProducts: ProductApiInterface = {
        products: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            thumbnail: 'https://example.com/image1.jpg',
          },
          {
            id: 2,
            title: 'Product 2',
            price: 200,
            thumbnail: 'https://example.com/image2.jpg',
          },
        ],
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockProducts,
      });

      const result = await fetchProducts(10);

      expect(apiClient.get).toHaveBeenCalledWith('/products/category/smartphones?limit=10');
      expect(result).toEqual(mockProducts);
      expect(result.products).toHaveLength(2);
    });

    it('should fetch products with a different limit', async () => {
      const mockProducts: ProductApiInterface = {
        products: [],
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockProducts,
      });

      await fetchProducts(5);

      expect(apiClient.get).toHaveBeenCalledWith('/products/category/smartphones?limit=5');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchProducts(10)).rejects.toThrow('API Error');
      expect(apiClient.get).toHaveBeenCalledWith('/products/category/smartphones?limit=10');
    });

    it('should return the data from the API response', async () => {
      const mockData: ProductApiInterface = {
        products: [
          {
            id: 3,
            title: 'Product 3',
            price: 300,
            thumbnail: 'https://example.com/image3.jpg',
          },
        ],
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockData,
      });

      const result = await fetchProducts(20);

      expect(result).toBe(mockData);
      expect(result.products[0].id).toBe(3);
    });
  });

  describe('fetchProductById', () => {
    it('should fetch a product by id', async () => {
      const mockProduct = {
        id: 1,
        title: 'Product 1',
        price: 100,
        thumbnail: 'https://example.com/image1.jpg',
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockProduct,
      });

      const result = await fetchProductById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
      expect(result.id).toBe(1);
    });

    it('should fetch a product with a different id', async () => {
      const mockProduct = {
        id: 42,
        title: 'Product 42',
        price: 500,
        thumbnail: 'https://example.com/image42.jpg',
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockProduct,
      });

      const result = await fetchProductById('42');

      expect(apiClient.get).toHaveBeenCalledWith('/products/42');
      expect(result.id).toBe(42);
      expect(result.title).toBe('Product 42');
    });

    it('should handle API errors when fetching by id', async () => {
      const mockError = new Error('Product not found');
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchProductById('999')).rejects.toThrow('Product not found');
      expect(apiClient.get).toHaveBeenCalledWith('/products/999');
    });

    it('should return the data from the API response', async () => {
      const mockProduct = {
        id: 5,
        title: 'Test Product',
        price: 150,
        thumbnail: 'https://example.com/test.jpg',
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockProduct,
      });

      const result = await fetchProductById('5');

      expect(result).toBe(mockProduct);
      expect(result.title).toBe('Test Product');
    });
  });
});
