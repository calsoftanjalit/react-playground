import { UI_CONSTANTS } from '@/constants/checkout';
import { useOrderSummaryCard } from '@/hooks/useOrderSummaryCard';
import classes from '@/styles/OrderSummaryCard.module.scss';
import { OrderSummaryCardProps } from '@/types/checkout';
import { formatPrice } from '@/utils/formatters';
import { Badge, Box, Divider, Group, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { IconShoppingBag, IconTags, IconTruck } from '@tabler/icons-react';
import { FC } from 'react';
import { OrderItem } from './OrderItem';

export const OrderSummaryCard: FC<OrderSummaryCardProps> = ({
  cart,
  isSticky = true,
  onCartUpdate,
}) => {
  const { localCart, itemCount, handleQuantityChange } = useOrderSummaryCard({
    cart,
    onCartUpdate,
  });

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
            <IconShoppingBag size={UI_CONSTANTS.ICON_SIZES.XL} />
            <Title order={3}>Order Summary</Title>
          </Group>
          <Badge size="lg" variant="light" color="blue" circle>
            {itemCount}
          </Badge>
        </Group>
        <Divider />
      </Box>

      <ScrollArea
        h={localCart.items.length <= 3 ? 'auto' : 375}
        mah={375}
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
            <Text fw={500}>${formatPrice(localCart.pricing.subtotal)}</Text>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <IconTruck size={UI_CONSTANTS.ICON_SIZES.SM} />
              <Text c="dimmed">Shipping</Text>
            </Group>
            <Text fw={500} c={localCart.pricing.shipping === 0 ? UI_CONSTANTS.COLORS.SUCCESS_TEXT : undefined}>
              {localCart.pricing.shipping === 0
                ? 'FREE'
                : `$${formatPrice(localCart.pricing.shipping)}`}
            </Text>
          </Group>

          <Group justify="space-between">
            <Text c="dimmed">Tax (9%)</Text>
            <Text fw={500}>${formatPrice(localCart.pricing.tax)}</Text>
          </Group>

          {(localCart.pricing.discount ?? 0) > 0 && (
            <Group justify="space-between">
              <Group gap="xs">
                <IconTags size={UI_CONSTANTS.ICON_SIZES.SM} />
                <Text c={UI_CONSTANTS.COLORS.SUCCESS_TEXT}>Discount</Text>
              </Group>
              <Text fw={500} c={UI_CONSTANTS.COLORS.SUCCESS_TEXT}>
                -${formatPrice(localCart.pricing.discount ?? 0)}
              </Text>
            </Group>
          )}
        </Stack>

        <Divider my="lg" />

        <Group justify="space-between">
          <Title order={4}>Total</Title>
          <Title order={3} c="blue">
            ${formatPrice(localCart.pricing.total)}
          </Title>
        </Group>
      </Box>
    </Paper>
  );
};
