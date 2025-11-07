import {
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Container,
} from "@mantine/core";

const products = [
  { id: 1, name: "Premium Product 1", price: 99.99 },
  { id: 2, name: "Premium Product 2", price: 149.99 },
  { id: 3, name: "Premium Product 3", price: 79.99 },
  { id: 4, name: "Premium Product 4", price: 129.99 },
];

export const PopularProducts = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Popular Products
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {products.map((product) => (
          <Card
            key={product.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text fw={500} size="lg" mt="md">
              {product.name}
            </Text>
            <Text c="dimmed" size="sm">
              ${product.price}
            </Text>
            <Button variant="light" fullWidth mt="md">
              Add to Cart
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};
