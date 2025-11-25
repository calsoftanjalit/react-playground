import { ChangeEvent } from 'react';
import { Input } from '@mantine/core';
import { useSearch } from '@/hooks';

export const Search = () => {
  const {input, setInput} = useSearch()
  return (
    <Input
      value={input}
      placeholder="Search products"
      className="w-1/3"
      onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
    />
  );
};
