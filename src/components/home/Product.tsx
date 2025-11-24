import { ProductInterface } from '@/types/product';
import { Button, Card, Image, Text } from '@mantine/core';
import QuantitySelector from './QuantitySelector';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';
import { Link } from 'react-router-dom';

export const Product: React.FC<ProductInterface> = ({ id, title, price, thumbnail }) => {
  const { handleAddCartProduct, updateItem, quantity, cartItem } = useAddCartProduct(id);

  return (
    <Card shadow="sm" padding="lg" radius="md" key={`product-${id}`} withBorder>
      <Link to={`/products/${id}`} className="linkReset">
        {thumbnail && <Image src={thumbnail} width={160} alt={title} radius="md"/>}
        <Text fw={500} size="lg" mt="md">
          {title}
        </Text>

        <Text c="dimmed" size="sm">
          ${price}
        </Text>
      </Link>

      {!cartItem ? (
        <Button
          variant="light"
          fullWidth
          mt="md"
          onClick={() => {
            handleAddCartProduct(id);
          }}
        >
          Add to Cart
        </Button>
      ) : (
        <QuantitySelector
          quantity={quantity}
          handleIncrement={() => {
            updateItem(id, cartItem.quantity + 1);
          }}
          handleDecrement={() => {
            updateItem(id, cartItem.quantity - 1);
          }}
        />
      )}
    </Card>
  );
};

export default Product;
