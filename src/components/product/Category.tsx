import { Select } from "@mantine/core"
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/hooks/useFilterStore";
import { fetchCategoryList } from "@/services/productService";

export const Category = () => {
	const { category, setCategory } = useFilterStore()
  const { data, error } = useQuery({
    queryKey: ['category-list'],
    queryFn: fetchCategoryList,
  })

  return (
		<Select
			value={category}
			onChange={setCategory}
			placeholder="Select Category"
			data={data}
			clearable
			error={error?.message}
		/>
  );
};
