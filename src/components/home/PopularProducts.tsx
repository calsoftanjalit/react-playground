import { fetchProducts } from '@/services/productService';
import { Title, SimpleGrid, Container } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { ProductInterface } from '@/types/product';
import Product from '@/components/home/Product';
import { ErrorMessage, LoadingIndicator } from '@/components/miscellaneous';

export const PopularProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(0, 4, null, ''),
  });

  if (isLoading) return <LoadingIndicator />;
  if (error?.message) return <ErrorMessage message={error?.message} />;

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Popular Products
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {data?.products?.map((product: ProductInterface) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            thumbnail={product.thumbnail}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};
