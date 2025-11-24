import { Box, Table, Text } from '@mantine/core';
import { useCallback } from 'react';
import { IconCurrencyDollar } from '@tabler/icons-react';
import CartTableRow from '@/components/Cart/CartTableRow';
import { useCartStore } from '@/context';
import { formatPrice } from '@/utils';
import { CartItem } from '@/types';
import { showToast } from '@/utils/showToast';

const TABLE_HEADERS = ['Image', 'Name', 'Price', 'Quantity', 'Total', 'Action'];

const CartTable: React.FC = () => {
  const { items, updateItem, removeItem, totalPrice, totalItems } = useCartStore();

  const handleRemove = useCallback(
    (item: CartItem) => {
      removeItem(item.id);
      showToast({
        type: 'success',
        title: 'Item Removed',
        message: `${item.title} removed successfully`,
        autoClose: 2500,
      });
    },
    [removeItem]
  );

  // AUTO REMOVE WHEN QUANTITY < 1 → WARNING Toast
  const handleQuantityChange = useCallback(
    (id: number, quantity: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      if (quantity < 1) {
        showToast({
          type: 'warning',
          title: 'Removed',
          message: `${item.title} removed from cart`,
          autoClose: 2500,
        });
        updateItem(id, 0);
      } else {
        // normal quantity update
        updateItem(id, quantity);
      }
    },
    [items, updateItem]
  );

  const getTotalPrice = (p: CartItem) => p.quantity * (p.discountedPrice || p.price);

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
                totalPrice={getTotalPrice(product)}
                onQuantityChange={handleQuantityChange}
                onRemove={() => handleRemove(product)}
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
