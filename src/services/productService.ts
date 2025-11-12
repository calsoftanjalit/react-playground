import apiClient from '@/services/apis/apiClient';
import { ProductApiInterface } from '@/types/product';

const PRODUCT_URL = '/products';

export const fetchProducts = async (limit: number): Promise<ProductApiInterface> => {
  const { data } = await apiClient.get(`${PRODUCT_URL}?limit=${limit}`);
  return data;
};
