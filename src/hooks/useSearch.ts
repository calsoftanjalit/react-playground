import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useFilterStore } from "./useFilterStore";

export const useSearch = () => {
    const { setSearchValue, setCategory } = useFilterStore();
    const [input, setInput] = useState('');
    const [debouncedValue] = useDebouncedValue(input.trim(), 500);
  
    useEffect(() => {
      setSearchValue(debouncedValue);

      if (debouncedValue?.length > 0) {
        setCategory(null);
      }
    }, [debouncedValue, setSearchValue, setCategory]);
  
  return{
    input,
    setInput
  }
}