import { ProductInterface } from '@/types/product';
import { Button, Card, Image, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const Product: React.FC<ProductInterface> = ({ id, title, price, thumbnail }) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      to={`/products/${id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card.Section>
        <Image src={thumbnail} height={160} alt={title} />
      </Card.Section>

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
        onClick={(e) => {
          e.preventDefault(); // preventing navigation if user clicks Add to Cart
        }}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default Product;
