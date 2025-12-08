import { Box } from '@mantine/core';
import { Search, Category } from '@/components/product';
import Sort from '@/components/product/Sort';

export const FilterBar = () => {
  return (
    <Box pb="md" className="w-full flex justify-between gap-4 items-center">
      <Search />
      <Sort />
      <Category />
    </Box>
  );
};
