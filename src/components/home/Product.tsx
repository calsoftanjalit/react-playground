import { ProductInterface } from "@/types/product";
import { Button, Card, Image, Text } from "@mantine/core";
import { useCartStore } from "@/context";
import QuantitySelector from "./QuantitySelector";
import { Link} from "react-router-dom";

const Product: React.FC<ProductInterface> = ({
  id,
  title,
  price,
  thumbnail,
}) => {
  const { items, addItem, updateItem, removeItem } = useCartStore();

  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, title, price });
  };

  const handleDecrement = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
     e.stopPropagation();
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeItem(id);
      return;
    }

    updateItem(id, cartItem.quantity - 1);
  };
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      key={`product-${id}`}
      withBorder      
    > 
      <Link to={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      {thumbnail && <Image src={thumbnail} height={160} alt={title} />}
      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>

      <Text c="dimmed" size="sm">
        ${price}
      </Text>
      </Link>

      {!cartItem ? (
        <Button variant="light" fullWidth mt="md" onClick={handleIncrement}>
          Add to Cart
        </Button>
      ) : (
        <QuantitySelector
          quantity={quantity}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
        />
      )}
    </Card>
  );
};

export default Product;
