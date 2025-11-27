import React, { useMemo, useState } from 'react';
import { Container, Group, Title, Box, Pagination } from '@mantine/core';
import { ErrorMessage, LoadingIndicator } from '@/components/miscellaneous';
import { FilterBar, ProductList } from '@/components/product';
import { useProduct } from '@/hooks';
import { useSearchParams } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useProduct(page, limit);
  const [params] = useSearchParams();

  if (error?.message) return <ErrorMessage message={error?.message} />;

  const sortOption = params.get('sort') ?? '';

  const sortedProducts = useMemo(() => {
    const products = [...(data?.products ?? [])];

    switch (sortOption) {
      case 'price-asc':
        return products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

      case 'price-desc':
        return products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

      case 'name-asc':
        return products.sort((a, b) =>
          String(a.title ?? '').localeCompare(String(b.title ?? ''), undefined, {
            sensitivity: 'base',
          })
        );

      case 'name-desc':
        return products.sort((a, b) =>
          String(b.title ?? '').localeCompare(String(a.title ?? ''), undefined, {
            sensitivity: 'base',
          })
        );

      default:
        return products;
    }
  }, [data?.products, sortOption]);

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Products
      </Title>

      <Group>
        <FilterBar />
      </Group>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <ProductList products={sortedProducts} />

          <Box mt="lg" className="flex justify-center">
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil((data?.total ?? 0) / limit)}
              size="md"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default ProductsPage;
