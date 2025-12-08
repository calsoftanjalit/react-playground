import React from 'react';
import { Select } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
];

const Sort: React.FC = () => {
  const [params, setParams] = useSearchParams();

  const handleSortChange = (value: string | null) => {
    // clone params so we don't mutate the same instance unexpectedly
    const next = new URLSearchParams(params.toString());

    if (value && value !== '') next.set('sort', value);
    else next.delete('sort');

    setParams(next);
  };

  return (
    <Select
      placeholder="Sort"
      value={params.get('sort') ?? ''}
      onChange={handleSortChange}
      data={SORT_OPTIONS}
      clearable
      searchable={false}
      style={{ width: 200 }}
    />
  );
};

export default Sort;
