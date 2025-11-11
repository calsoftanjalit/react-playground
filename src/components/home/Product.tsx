import { ProductInterface } from '@/types/product';
import { Button, Card, Text } from '@mantine/core';

const Product: React.FC<ProductInterface> = ({ id, title, price }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>
      <Text c="dimmed" size="sm">
        ${price}
      </Text>
      <Button variant="light" fullWidth mt="md">
        Add to Cart
      </Button>
    </Card>
  );
};

export default Product;
