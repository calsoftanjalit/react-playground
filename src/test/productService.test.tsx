import apiClient from '@/services/apis/apiClient';
import { fetchProducts, fetchProductById, fetchCategoryList } from '@/services/productService';
import { ProductApiInterface } from '@/types/product';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    it('calls correct default URL (only limit)', async () => {
      const mockData: ProductApiInterface = { products: [] };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockData,
      });

      await fetchProducts(10, null, '');

      expect(apiClient.get).toHaveBeenCalledWith('/products?limit=10');
    });

    it('calls correct URL when category is provided', async () => {
      const mockData: ProductApiInterface = { products: [] };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockData,
      });

      await fetchProducts(10, 'Fashion', '');

      expect(apiClient.get).toHaveBeenCalledWith('/products/category/Fashion?limit=10');
    });

    it('calls correct URL when searchValue is provided', async () => {
      const mockData: ProductApiInterface = { products: [] };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockData,
      });

      await fetchProducts(10, null, 'shoes');

      expect(apiClient.get).toHaveBeenCalledWith('/products/search?q=shoes&limit=10');
    });

    it('returns product data', async () => {
      const mockData: ProductApiInterface = {
        products: [{ id: 1, title: 'Test', price: 100, thumbnail: '' }],
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockData,
      });

      const result = await fetchProducts(5, null, '');

      expect(result).toEqual(mockData);
    });

    it('throws error when API fails', async () => {
      const mockError = new Error('API Error');
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchProducts(10, null, '')).rejects.toThrow('API Error');
    });
  });

  describe('fetchProductById', () => {
    it('fetches product using ID', async () => {
      const mockData = { id: 1 };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockData });

      const result = await fetchProductById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockData);
    });

    it('throws error on API failure', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not found'));

      await expect(fetchProductById('999')).rejects.toThrow('Not found');
    });
  });

  describe('fetchCategoryList', () => {
    it('fetches category list successfully', async () => {
      const mockCategories = ['Fashion', 'Electronics'];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockCategories,
      });

      const result = await fetchCategoryList();

      expect(apiClient.get).toHaveBeenCalledWith('/products/category-list');
      expect(result).toEqual(mockCategories);
    });

    it('throws error when categories API fails', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed'));

      await expect(fetchCategoryList()).rejects.toThrow('Failed');
    });
  });
});
