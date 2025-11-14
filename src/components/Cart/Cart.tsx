import { Button, Card, Divider, Text } from '@mantine/core';
import CartTable from './CartTable';

const Cart: React.FC = () => {
  return (
    <>
      <Card shadow="sm" padding="md" radius="md" className="w-full">
        <Text fw={500} size="xl">
          Cart Items
        </Text>
        <Divider my="md" />
        <CartTable />
        <Button color="blue" fullWidth mt="md" radius="md">
          Checkout
        </Button>
      </Card>
    </>
  );
};

export default Cart;
