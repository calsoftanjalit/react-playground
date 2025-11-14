import { CartTableRowProps } from '@/types/cart';
import { Image, Table } from '@mantine/core';
import React from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import QuantitySelector from '../home/QuantitySelector';

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
      <Table.Td className="break-words whitespace-normal max-w-[275px]">{product.title}</Table.Td>
      <Table.Td>{product.price.toFixed(2)}</Table.Td>
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
      <Table.Td>{totalPrice.toFixed(2)}</Table.Td>
      <Table.Td ta="center">
        <MdOutlineDeleteOutline
          size={20}
          color="#FF0000"
          className="cursor-pointer hover:scale-125"
          onClick={() => onRemove(product.id)}
        />
      </Table.Td>
    </Table.Tr>
  );
};

export default React.memo(CartTableRow);
