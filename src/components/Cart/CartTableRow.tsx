import { CartTableRowProps } from '@/types/cart';
import { Box, Image, Table } from '@mantine/core';
import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import QuantitySelector from '../home/QuantitySelector';
import { formatPrice } from '@/utils';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { IconCurrencyDollar } from '@tabler/icons-react';

const CartTableRow: React.FC<CartTableRowProps> = ({
  product,
  onQuantityChange,
  onRemove,
  quantity,
  totalPrice,
}) => {
  return (
    <Table.Tr key={product.id} ta="left">
      <Table.Td>
        <Image src={product.thumbnail} height={50} width={50} alt={product.title} />
      </Table.Td>
      <Table.Td className="break-words whitespace-normal max-w-[275px]">
        <Link to={`${ROUTE_PATHS.PRODUCTS}/${product.id}`}>{product.title}</Link>
      </Table.Td>
      <Table.Td>
        <Box className="flex items-center">
          <IconCurrencyDollar size={14} />
          {formatPrice(product.price)}
        </Box>
      </Table.Td>
      <Table.Td ta="center">
        <QuantitySelector
          quantity={quantity}
          handleIncrement={() => {
            onQuantityChange(product.id, quantity + 1);
          }}
          handleDecrement={() => {
            onQuantityChange(product.id, quantity - 1);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Box className="flex items-center">
          <IconCurrencyDollar size={14} />
          {formatPrice(totalPrice)}
        </Box>
      </Table.Td>
      <Table.Td ta="center">
        <IconTrash
          size={20}
          color="red"
          className="cursor-pointer hover:scale-125"
          onClick={() => onRemove(product.id)}
        />
      </Table.Td>
    </Table.Tr>
  );
};

export default React.memo(CartTableRow);
