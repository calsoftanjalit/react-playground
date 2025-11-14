import { useAddCartProduct } from '@/hooks/useAddCartProduct';
import { ProductInterface } from '@/types/product';
import { Button, Card, Image, Text } from '@mantine/core';

const Product: React.FC<ProductInterface> = ({ id, title, price, thumbnail }) => {
  const { handleAddCartProduct, mutation } = useAddCartProduct();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Image src={thumbnail} height={160} alt={title} />
      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>
      <Text c="dimmed" size="sm">
        ${price}
      </Text>
      <Button
        variant="light"
        fullWidth
        mt="md"
        onClick={() => handleAddCartProduct(id)}
        disabled={mutation.isPending}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default Product;
