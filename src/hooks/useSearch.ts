import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useFilterStore } from "./useFilterStore";
import { DEBOUNCE_TIME_VALUE } from '@/constants';

export const useSearch = () => {
    const { setSearchValue, setCategoryList } = useFilterStore();
    const [input, setInput] = useState('');
    const [debouncedValue] = useDebouncedValue(input.trim(), DEBOUNCE_TIME_VALUE);
  
    useEffect(() => {
      setSearchValue(debouncedValue);

      if (debouncedValue.length > 0) {
        setCategoryList(null);
      }
    }, [debouncedValue, setSearchValue, setCategoryList]);
  
  return{
    input,
    setInput
  }
}