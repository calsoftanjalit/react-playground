import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { useFilterStore } from "./useFilterStore";

const useProduct = () => {
  const {categoryList, searchValue} = useFilterStore()
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchValue, categoryList],
    queryFn: () => fetchProducts(10, categoryList, searchValue),
  });

  return{
    data,
    isLoading,
    error,
  }
}

export default useProduct