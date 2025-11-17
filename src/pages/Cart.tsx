import { Box, Button, Card, Divider, Text } from '@mantine/core';
import CartTable from '@/components/Cart/CartTable';
import { useCartStore } from '@/context';

const Cart: React.FC = () => {
  const { totalItems } = useCartStore()
  return (
  <Box className="flex justify-center items-start w-full mt-10">
    <Card shadow="sm" p="lg" radius="md" className="space-y-4">
      <Text fw={600} size="xl" mb="1.5rem">
        Cart Items
      </Text>

      <Divider />

      <Box p="1.5rem">
        <CartTable />
      </Box>

      {totalItems > 0 && (<Box className="flex justify-center" mt="1.5rem">
        <Button color="blue" fullWidth radius="md" className='w-1/5'>
          Checkout
        </Button>
      </Box>)}
    </Card>
  </Box>
)};

export default Cart;
