import classes from '@/styles/OrderItem.module.scss';
import { OrderItemProps } from '@/types/cart';
import { formatPrice } from '@/utils/formatters';
import { ActionIcon, Box, Group, Image, Paper, Stack, Text } from '@mantine/core';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { FC } from 'react';

export const OrderItem: FC<OrderItemProps> = ({
  item,
  showRemove = false,
  onRemove,
  showQuantityControls = false,
  onQuantityChange,
}) => {
  const itemTotal = item.price * item.quantity;

  const handleIncrement = () => {
    if (onQuantityChange) {
      onQuantityChange(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (onQuantityChange && item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Group wrap="nowrap" align="flex-start">
        <Image
          src={item.thumbnail}
          alt={item.title}
          w={80}
          h={80}
          radius="sm"
          fit="cover"
          fallbackSrc="https://placehold.co/80x80?text=Product"
        />

        <Stack gap="xs" className={classes.productDetails}>
          <Group justify="space-between" wrap="nowrap">
            <Box className={classes.productTitle}>
              <Text fw={600} size="sm" lineClamp={2}>
                {item.title}
              </Text>
            </Box>
            {showRemove && onRemove && (
              <IconX
                size={18}
                className={classes.removeIcon}
                onClick={() => onRemove(item.id)}
              />
            )}
          </Group>

          <Group justify="space-between" align="center">
            <Group gap="xs">
              {showQuantityControls && onQuantityChange ? (
                <Group gap={4}>
                  <ActionIcon
                    size="sm"
                    variant="light"
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1}
                  >
                    <IconMinus size={14} />
                  </ActionIcon>
                  <Text size="sm" fw={500} className={classes.quantityText}>
                    {item.quantity}
                  </Text>
                  <ActionIcon size="sm" variant="light" onClick={handleIncrement}>
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              ) : (
                <Text size="xs" c="dimmed">
                  Qty: {item.quantity}
                </Text>
              )}
            </Group>
            <Text fw={600} size="sm">
              ${formatPrice(itemTotal)}
            </Text>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
