import { useMemo, useState } from 'react';
import { FilterProviderProps } from '@/types';
import { FilterContext } from './FilterContext';

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [category, setCategory] = useState<string | null | undefined>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const value = useMemo(
    () => ({
      category,
      setCategory,
      searchValue,
      setSearchValue,
    }),
    [category, searchValue]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
