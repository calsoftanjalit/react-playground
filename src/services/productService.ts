import apiClient from '@/services/apis/apiClient';
import { ProductApiInterface } from '@/types/product';

const PRODUCT_URL = '/products';
const PRODUCT_CATEGORY_URL = '/products/category/smartphones';

export const fetchProducts = async (limit: number): Promise<ProductApiInterface> => {
  const { data } = await apiClient.get(`${PRODUCT_CATEGORY_URL}?limit=${limit}`);
  return data;
};

export const fetchProductById = async(id:string)=>{
  const {data} = await apiClient.get(`${PRODUCT_URL}/${id}`)
  return data
}
