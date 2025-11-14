import { Box, Button, Card, Divider, Text } from '@mantine/core';
import CartTable from '@/components/Cart/CartTable';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';

const Cart: React.FC = () => (
  <Card shadow="sm" p="lg" radius="md" className="w-full space-y-4">
    <Box className="flex">
      <Link to={ROUTE_PATHS.HOME}>Back to Home</Link>
    </Box>
    <Text fw={600} size="xl">
      Cart Items
    </Text>

    <Divider />

    <CartTable />

    <Button color="blue" fullWidth radius="md">
      Checkout
    </Button>
  </Card>
);

export default Cart;
