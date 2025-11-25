import { useMemo, useState } from 'react';
import { FilterProviderProps } from '@/types';
import { FilterContext } from './FilterContext';

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [categoryList, setCategoryList] = useState<string | null | undefined>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const value = useMemo(
    () => ({
      categoryList,
      setCategoryList,
      searchValue,
      setSearchValue,
    }),
    [categoryList, searchValue]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
