import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productService';
import { useFilterStore } from './useFilterStore';

export const useProduct = (page: number, limit: number) => {
  const { categoryList, searchValue } = useFilterStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, limit, searchValue, categoryList],
    queryFn: () => fetchProducts(page, limit, categoryList, searchValue),
  });

  return {
    data,
    isLoading,
    error,
  };
};
