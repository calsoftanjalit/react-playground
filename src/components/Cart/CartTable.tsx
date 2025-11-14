import { Table } from '@mantine/core';
import { useCart } from '@/hooks/useCart';
import CartTableRow from './CartTableRow';

const tableHeader = ['Image', 'Name', 'Price', 'Quantity', 'Total', 'Action'];

const CartTable: React.FC = () => {
  const { cartItems, total, handleQuantityChange, handleRemoveItem } = useCart();
  return (
    <>
      <Table horizontalSpacing="xl">
        <Table.Thead>
          <Table.Tr>
            {tableHeader.map((header) => (
              <Table.Th key={header}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cartItems.map((product) => (
            <CartTableRow
              key={product.id}
              product={product}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
          <Table.Tr ta="left">
            <Table.Td fw={500}>Total</Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td>{total}</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </>
  );
};

export default CartTable;
