import { useCartStore } from '@/context';
import { Box, Text } from '@mantine/core';
import { LuShoppingCart } from 'react-icons/lu';

const CartIcon = () => {
  const { totalItems } = useCartStore();
  return (
    <Box mx="sm" className="flex cursor-pointer">
      <LuShoppingCart size={20} />
      <Text px="2px">{totalItems}</Text>
    </Box>
  );
};

export default CartIcon;
