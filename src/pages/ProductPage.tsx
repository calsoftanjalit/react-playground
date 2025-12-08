import { useState } from 'react';
import { Container, Group, Title, Box, Pagination } from '@mantine/core';
import { ErrorMessage, LoadingIndicator } from '@/components/miscellaneous';
import { FilterBar, ProductList } from '@/components/product';
import { useProduct } from '@/hooks';
import { RecentlyViewed } from '@/components/recently-viewed';

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useProduct(page, limit);

  if (error?.message) return <ErrorMessage message={error?.message} />;

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
          <ProductList products={data?.products ?? []} />
          <RecentlyViewed />
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
