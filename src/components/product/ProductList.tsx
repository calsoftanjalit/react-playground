import { useMemo, useState } from 'react';
import { Box, SimpleGrid, Text, Pagination } from '@mantine/core';
import { ProductApiInterface, ProductInterface } from '@/types';
import { Product } from '@/components/home';

const PRODUCTS_PER_PAGE = 8;

export const ProductList: React.FC<ProductApiInterface> = ({ products }) => {
  const [page, setPage] = useState(1);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  // Calculate paginated products
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, page]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  return (
    <>
      {hasProducts ? (
        <>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
            {paginatedProducts.map((product: ProductInterface) => (
              <Product
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                thumbnail={product.thumbnail}
              />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Box mt="lg" display="flex" >
              <Pagination value={page} onChange={setPage} total={totalPages} size="md" mx="auto" />
            </Box>
          )}
        </>
      ) : (
        <Box className="w-full">
          <Text ta="center" fw={500} size="1.5rem">Products are not available</Text>
        </Box>
      )}
    </>
  );};
