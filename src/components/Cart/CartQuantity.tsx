import { FiPlus, FiMinus } from 'react-icons/fi';

import { CartQuantityInterface } from '@/types/cart';
import { ActionIcon, Box, Text } from '@mantine/core';
import { useState } from 'react';

const CartQuantity: React.FC<CartQuantityInterface> = ({ quantity, onQuantityChange }) => {
  const [updateQuantity, setUpdateQuantity] = useState(quantity);

  const decrementQuantity = () => {
    setUpdateQuantity((prevQuantity) => {
      const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : prevQuantity;
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  };

  const incrementQuantity = () => {
    setUpdateQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  };
  return (
    <Box className="flex items-center">
      <ActionIcon
        size="lg"
        variant="light"
        color="yellow"
        radius="md"
        className="transition-transform hover:scale-125 focus:outline-hidden hover:border-hidden"
        onClick={incrementQuantity}
      >
        <FiPlus size={20} className="cursor-pointer" />
      </ActionIcon>
      <Box px="md">
        <Text size="md">{updateQuantity}</Text>
      </Box>
      <ActionIcon
        size="lg"
        variant="light"
        color="yellow"
        radius="md"
        className="transition-transform hover:scale-125 focus:outline-hidden hover:border-hidden"
        onClick={decrementQuantity}
      >
        <FiMinus size={20} className="cursor-pointer" />
      </ActionIcon>
    </Box>
  );
};

export default CartQuantity;
