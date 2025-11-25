import { Select } from "@mantine/core"
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/hooks/useFilterStore";
import { fetchCategoryList } from "@/services/productService";

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
