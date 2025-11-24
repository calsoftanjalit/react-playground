import { useMemo } from "react";
import { Box, SimpleGrid, Text } from "@mantine/core";
import { ProductApiInterface, ProductInterface } from "@/types";
import { Product } from "@/components/home";

export const ProductList: React.FC<ProductApiInterface> = ({ products }) => {
  const hasProducts = useMemo( () => products.length > 0, [products]);
  return (
    <>
      {hasProducts ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
          {products?.map((product: ProductInterface) => (
            <Product
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              thumbnail={product.thumbnail}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box className="w-full">
          <Text ta="center" fw={500} size="1.5rem"> Product is not avalible</Text>
        </Box>
      )}
    </>
  );};
