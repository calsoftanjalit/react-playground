import { Button, Card, Image, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { ProductInterface } from '@/types/product';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';
import { WishlistButton } from '@/components/common/WishlistButton';
import QuantitySelector from '@/components/home/QuantitySelector';
import { showToast } from '@/utils';
import styles from '@/styles/Product.module.scss';

export const Product = (product: ProductInterface) => {
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
