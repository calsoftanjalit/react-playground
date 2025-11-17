import { Table } from '@mantine/core';
import CartTableRow from '@/components/Cart/CartTableRow';
import { useCartStore } from '@/context';
import { useCallback } from 'react';

const TABLE_HEADERS = ['Image', 'Name', 'Price', 'Quantity', 'Total', 'Action'];

const CartTable: React.FC = () => {
  const { items, updateItem, removeItem, totalPrice } = useCartStore();

  const handleQuantityChange = useCallback(
    (id: number, quantity: number) => {
      updateItem(id, quantity);
    },
    [updateItem]
  );

  const handleRemove = useCallback(
    (id: number) => {
      removeItem(id);
    },
    [removeItem]
  );

  return (
    <>
      <Table horizontalSpacing="xl">
        <Table.Thead>
          <Table.Tr>
            {TABLE_HEADERS.map((header) => (
              <Table.Th key={header}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((product) => (
            <CartTableRow
              key={product.id}
              product={product}
              quantity={product.quantity}
              totalPrice={product.quantity * product.price}
              onQuantityChange={handleQuantityChange}
              onRemove={() => handleRemove(product.id)}
            />
          ))}
          <Table.Tr ta="left">
            <Table.Td fw={500}>Total</Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td>{totalPrice.toFixed(2)}</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </>
  );
};

export default CartTable;
