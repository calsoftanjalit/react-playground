import { Container, Group, Title } from "@mantine/core";
import { ErrorMessage, LoadingIndicator } from "@/components/miscellaneous";
import useProduct from "@/hooks/useProduct";
import { FilterBar, ProductList } from "@/components/product";

const ProductsPage=() =>{
  const {data, isLoading, error} = useProduct()
  
  if (error?.message) return <ErrorMessage message={error?.message} />;

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Products
      </Title>
      <Group>
        <FilterBar />
      </Group>
      {isLoading ?  <LoadingIndicator /> :
        <ProductList
          products={data?.products ?? []}
        />
      }
    </Container>
  );
}

export default ProductsPage