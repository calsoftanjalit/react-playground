import { UI_CONSTANTS } from '@/constants/checkout';
import classes from '@/styles/OrderSummaryCard.module.scss';
import { CheckoutCart } from '@/types/checkout';
import { recalculatePricing } from '@/utils';
import { Badge, Box, Divider, Group, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { IconShoppingBag, IconTags, IconTruck } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { OrderItem } from './OrderItem';

interface OrderSummaryCardProps {
  cart: CheckoutCart;
  isSticky?: boolean;
  onCartUpdate?: (updatedCart: CheckoutCart) => void;
}

export const OrderSummaryCard: FC<OrderSummaryCardProps> = ({
  cart,
  isSticky = true,
  onCartUpdate,
}) => {
  const [localCart, setLocalCart] = useState(cart);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const itemCount = localCart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedItems = localCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const updatedPricing = recalculatePricing(updatedItems, localCart.pricing.discount || 0);

    const updatedCart: CheckoutCart = {
      items: updatedItems,
      pricing: updatedPricing,
    };

    setLocalCart(updatedCart);
    if (onCartUpdate) {
      onCartUpdate(updatedCart);
    }
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="lg"
      withBorder
      className={isSticky ? classes.orderSummaryCard : undefined}
    >
      <Box>
        <Group justify="space-between" align="center" mb="lg">
          <Group gap="xs">
            <IconShoppingBag size={24} />
            <Title order={3}>Order Summary</Title>
          </Group>
          <Badge size="lg" variant="light" color="blue" circle>
            {itemCount}
          </Badge>
        </Group>
        <Divider />
      </Box>

      <ScrollArea
        h={localCart.items.length <= 2 ? 'auto' : 245}
        mah={245}
        type="scroll"
        offsetScrollbars
        classNames={{
          root: classes.scrollArea,
          viewport: classes.scrollViewport,
        }}
      >
        <Stack gap="md">
          {localCart.items.map((item) => (
            <OrderItem
              key={item.id}
              item={item}
              showQuantityControls={!!onCartUpdate}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </Stack>
      </ScrollArea>

      <Box>
        <Divider mb="lg" />

        <Stack gap="sm">
          <Group justify="space-between">
            <Text c="dimmed">Subtotal</Text>
            <Text fw={500}>${localCart.pricing.subtotal.toFixed(2)}</Text>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <IconTruck size={16} />
              <Text c="dimmed">Shipping</Text>
            </Group>
            <Text fw={500} c={localCart.pricing.shipping === 0 ? UI_CONSTANTS.COLORS.SUCCESS_TEXT : undefined}>
              {localCart.pricing.shipping === 0
                ? 'FREE'
                : `$${localCart.pricing.shipping.toFixed(2)}`}
            </Text>
          </Group>

          <Group justify="space-between">
            <Text c="dimmed">Tax (9%)</Text>
            <Text fw={500}>${localCart.pricing.tax.toFixed(2)}</Text>
          </Group>

          {localCart.pricing.discount && localCart.pricing.discount > 0 && (
            <Group justify="space-between">
              <Group gap="xs">
                <IconTags size={16} />
                <Text c={UI_CONSTANTS.COLORS.SUCCESS_TEXT}>Discount</Text>
              </Group>
              <Text fw={500} c={UI_CONSTANTS.COLORS.SUCCESS_TEXT}>
                -${localCart.pricing.discount.toFixed(2)}
              </Text>
            </Group>
          )}
        </Stack>

        <Divider my="lg" />

        <Group justify="space-between">
          <Title order={4}>Total</Title>
          <Title order={3} c="blue">
            ${localCart.pricing.total.toFixed(2)}
          </Title>
        </Group>
      </Box>
    </Paper>
  );
};
