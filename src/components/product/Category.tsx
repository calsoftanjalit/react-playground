import { Select } from "@mantine/core"
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryList } from "@/services/productService";
import { useFilterStore } from "@/hooks";

export const Category = () => {
	const { categoryList, setCategoryList } = useFilterStore()
	const { data, error } = useQuery({
	  queryKey: ['category-list'],
	  queryFn: fetchCategoryList,
	})

  return (
    <Select
      value={categoryList}
      onChange={setCategoryList}
      placeholder="Select Category"
      data={data}
      clearable
      error={error?.message}
    />
  );
};
