import { ProductInterface } from "@/types/product";
import {
  Button,
  Card,
  Image,
  Text,
  Group,
  ActionIcon,
  Badge,
  Box,
} from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { useCartStore } from "@/context";

const Product: React.FC<ProductInterface> = ({
  id,
  title,
  price,
  thumbnail,
}) => {
  const { items, addItem, updateItem, removeItem } = useCartStore();

  const cartItem = items.find((i) => i.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleIncrement = () => {
    addItem({ id, title, price });
  };

  const handleDecrement = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeItem(id);
      return;
    }

    updateItem(id, cartItem.quantity - 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" key={`product-${id}`} withBorder>
      {thumbnail && <Image src={thumbnail} height={160} alt={title} />}
      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>
      <Text c="dimmed" size="sm">
        ${price}
      </Text>

      {!cartItem ? (
        <Button variant="light" fullWidth mt="md" onClick={handleIncrement}>
          Add to Cart
        </Button>
      ) : (
        <Box mt="md">
          <Group justify="center">
            <ActionIcon
              variant="light"
              size="lg"
              onClick={handleDecrement}
              aria-label={`Decrease quantity for ${title}`}
            >
              <IconMinus size={18} />
            </ActionIcon>

            <Badge variant="light" size="lg">
              {quantity}
            </Badge>

            <ActionIcon
              variant="light"
              size="lg"
              onClick={handleIncrement}
              aria-label={`Increase quantity for ${title}`}
            >
              <IconPlus size={18} />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Card>
  );
};

export default Product;
