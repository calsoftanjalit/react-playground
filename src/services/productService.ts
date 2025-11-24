import apiClient from '@/services/apis/apiClient';
import { ProductApiInterface } from '@/types/product';

type category = string | null | undefined;

const PRODUCT_URL = '/products';
const PRODUCT_CATEGORY_URL = '/products/category';
const CATEGORY_LIST_URL = `${PRODUCT_URL}/category-list`;

export const fetchProducts = async (
  limit: number, 
  category: category, 
  searchValue: string): Promise<ProductApiInterface> => {
  const strLimit = `limit=${limit}`
  const searchUrl = searchValue ? `/search?q=${searchValue}&${strLimit}` : `?${strLimit}`;

  const setUpUrl: string = category
    ? `${PRODUCT_CATEGORY_URL}/${category}?${strLimit}`
    : `${PRODUCT_URL}${searchUrl}`;
  const { data } = await apiClient.get(setUpUrl);
  return data;
};

export const fetchProductById = async(id:string)=>{
  const {data} = await apiClient.get(`${PRODUCT_URL}/${id}`)
  return data
}

export const fetchCategoryList = async(): Promise<string[]> => {
  const {data} = await apiClient.get(CATEGORY_LIST_URL)
  return data
}
