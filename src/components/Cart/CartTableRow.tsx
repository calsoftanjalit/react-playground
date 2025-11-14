import { CartTableRowProps } from '@/types/cart';
import { Image, Table } from '@mantine/core';
import { useMemo } from 'react';
import CartQuantity from './CartQuantity';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const CartTableRow: React.FC<CartTableRowProps> = ({ product, onQuantityChange, onRemove }) => {
  const totalPrice = useMemo(
    () => (product.price * product.quantity).toFixed(2),
    [product.price, product.quantity]
  );

  return (
    <Table.Tr key={product.id} ta="left">
      <Table.Td>
        <Image src={product.thumbnail} height={50} width={50} alt={product.title} />
      </Table.Td>
      <Table.Td className="break-words whitespace-normal max-w-[275px]">{product.title}</Table.Td>
      <Table.Td>{product.price.toFixed(2)}</Table.Td>
      <Table.Td ta="center">
        <CartQuantity
          quantity={product.quantity}
          onQuantityChange={(newQuantity) => onQuantityChange(product.id, newQuantity)}
        />
      </Table.Td>
      <Table.Td>{totalPrice}</Table.Td>
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

export default CartTableRow;
