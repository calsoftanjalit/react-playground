import { ProductInterface } from '@/types/product';
import { Button, Card, Image, Text } from '@mantine/core';
import QuantitySelector from './QuantitySelector';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';
import { Link } from 'react-router-dom';
import { WishlistButton } from '../common/WishlistButton';
import { FC } from 'react';
import styles from '@/styles/Product.module.scss';
import { showToast } from '@/utils';

export const Product: FC<ProductInterface> = (product) => {
  const { id, title, price, thumbnail } = product;
  const { handleAddCartProduct, updateItem, quantity, cartItem } = useAddCartProduct(id);

  return (
    <Card shadow="sm" padding="lg" radius="md" key={`product-${id}`} withBorder pos="relative">
      <WishlistButton
        product={product}
        variant="transparent"
        pos="absolute"
        top={10}
        right={10}
        className={styles.wishlistButton}
      />
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
            if (cartItem.quantity === 1) {
              updateItem(id, 0);
              showToast({
                type: 'warning',
                title: 'Removed',
                message: `${title} removed from cart`,
                autoClose: 3000,
              });
            } else {
              updateItem(id, cartItem.quantity - 1);
            }
          }}
        />
      )}
    </Card>
  );
};

export default Product;
