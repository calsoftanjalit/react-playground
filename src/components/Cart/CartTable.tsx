import { Box, Table, Text } from '@mantine/core';
import CartTableRow from '@/components/Cart/CartTableRow';
import { useCartStore } from '@/context';
import { useCallback } from 'react';
import { formatPrice } from '@/utils';
import { IconCurrencyDollar } from '@tabler/icons-react';

const TABLE_HEADERS = ['Image', 'Name', 'Price', 'Quantity', 'Total', 'Action'];

const CartTable: React.FC = () => {
  const { items, updateItem, removeItem, totalPrice, totalItems } = useCartStore();

  const handleQuantityChange = useCallback(
    (id: number, quantity: number) => updateItem(id, quantity),
    [updateItem]
  );

  const handleRemove = useCallback((id: number) => removeItem(id), [removeItem]);

  return (
    <Table horizontalSpacing="xl">
      <Table.Thead>
        <Table.Tr>
          {TABLE_HEADERS.map((header) => (
            <Table.Th key={header} ta="center">
              {header}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {totalItems ? (
          <>
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

            <Table.Tr>
              <Table.Td fw={600}>Total</Table.Td>
              <Table.Td />
              <Table.Td />
              <Table.Td />
              <Table.Td>
                <Box className="flex items-center">
                  <IconCurrencyDollar size={14} />
                  {formatPrice(totalPrice)}
                </Box>
              </Table.Td>
              <Table.Td />
            </Table.Tr>
          </>
        ) : (
          <Table.Tr>
            <Table.Td colSpan={6} ta="center">
              <Text size="xl" fw={500} mt="1.5rem">
                Your Cart is empty
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};

export default CartTable;
