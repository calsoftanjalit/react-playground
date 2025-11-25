import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useFilterStore } from "./useFilterStore";

export const useSearch = () => {
    const { setSearchValue, setCategoryList } = useFilterStore();
    const [input, setInput] = useState('');
    const [debouncedValue] = useDebouncedValue(input.trim(), 500);
  
    useEffect(() => {
      setSearchValue(debouncedValue);

      if (debouncedValue?.length > 0) {
        setCategoryList(null);
      }
    }, [debouncedValue, setSearchValue, setCategoryList]);
  
  return{
    input,
    setInput
  }
}