import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { useFilterStore } from "./useFilterStore";

const useProduct = () => {
  const {category, searchValue} = useFilterStore()
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchValue, category],
    queryFn: () => fetchProducts(10, category, searchValue),
  });

  return{
    data,
    isLoading,
    error,
  }
}

export default useProduct