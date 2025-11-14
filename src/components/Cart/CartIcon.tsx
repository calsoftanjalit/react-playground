import { Box, Text } from '@mantine/core';
import { LuShoppingCart } from 'react-icons/lu';

const ITEMS_COUNT = 0;
const CartIcon = () => {
  return (
    <Box mx="sm" className="flex cursor-pointer">
      <LuShoppingCart size={20} />
      <Text px="2px">{ITEMS_COUNT}</Text>
    </Box>
  );
};

export default CartIcon;
