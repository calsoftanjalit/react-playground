import { useCartStore } from '@/context';
import { Box, Text } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

const CartIndicator = () => {
  const { totalItems } = useCartStore();
  return (
    <Box mx="sm" className="flex cursor-pointer">
      <IconShoppingCart size={20} />
      <Text px="0.12rem">{totalItems}</Text>
    </Box>
  );
};

export default CartIndicator;
