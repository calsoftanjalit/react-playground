import { useContext } from 'react';
import { FilterContext } from '@/context/FilterContext';
import { FilterContextType } from '@/types';

export const useFilterStore = (): FilterContextType => {
  const context = useContext(FilterContext);

  if (context === undefined) {
    throw new Error('useFilterStore must be used within a FilterProvider');
  }

  return context;
};
