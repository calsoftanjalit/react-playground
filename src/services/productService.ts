import apiClient from '@/services/apis/apiClient';
import { ProductApiInterface } from '@/types/product';

type category = string | null | undefined;

const PRODUCT_URL = '/products';
const PRODUCT_CATEGORY_URL = '/products/category';
const CATEGORY_LIST_URL = `${PRODUCT_URL}/category-list`;

export const fetchProducts = async (
  page: number,
  limit: number,
  category: category,
  searchValue: string
): Promise<ProductApiInterface> => {
  const skip = (page - 1) * limit;

  const strPagination = `limit=${limit || 5}&skip=${skip}`;

  const searchUrl = searchValue
    ? `/search?q=${encodeURIComponent(searchValue)}&${strPagination}`
    : `?${strPagination}`;

  const setUpUrl: string = category
    ? `${PRODUCT_CATEGORY_URL}/${category}?${strPagination}`
    : `${PRODUCT_URL}${searchUrl}`;
  const { data } = await apiClient.get(setUpUrl);
  return data;
};

export const fetchProductById = async (id: string) => {
  const { data } = await apiClient.get(`${PRODUCT_URL}/${id}`);
  return data;
};

export const fetchCategoryList = async (): Promise<string[]> => {
  const { data } = await apiClient.get(CATEGORY_LIST_URL);
  return data;
};
