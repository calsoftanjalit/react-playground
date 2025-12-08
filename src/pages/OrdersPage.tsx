import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, Stack, Card, Badge, Group, Box, Button, Image } from '@mantine/core';
import { IconPackage, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getUserOrders } from '@/services/orderService';
import { ICON_SIZES } from '@/constants/ui';
import styles from '@/styles/OrdersPage.module.scss';

export const OrdersPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const orders = useMemo(() => {
    if (!user) return [];
    return getUserOrders(user.id);
  }, [user]);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="lg" radius="md">
          <Title order={2}>My Orders</Title>
          <Text c="dimmed" size="sm">
            View and track your order history
          </Text>
        </Paper>

        {orders.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md">
            <Stack align="center" gap="md">
              <IconPackage size={ICON_SIZES.XXL} color="var(--mantine-color-gray-5)" />
              <Title order={3}>No Orders Yet</Title>
              <Text c="dimmed" ta="center">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </Text>
              <Button component="a" href="/">
                Start Shopping
              </Button>
            </Stack>
          </Card>
        ) : (
          <Stack gap="md">
            {orders.map(order => (
              <Card key={order.id} shadow="sm" padding="lg" radius="md" className={styles.orderCard}>
                <Group justify="space-between" mb="md">
                  <Box>
                    <Text fw={600} size="lg">
                      Order #{order.id}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Box>
                  <Badge
                    color="green"
                    variant="light"
                    size="lg"
                  >
                    Delivered
                  </Badge>
                </Group>

                <Stack gap="md" mb="md">
                  {order.items.slice(0, expandedOrders[order.id] ? order.items.length : 4).map(item => (
                    <Box
                      key={item.id}
                      className={styles.orderItem}
                      onClick={() => handleProductClick(item.id)}
                    >
                      <Group gap="md" wrap="nowrap">
                        {item.thumbnail && (
                          <Box className={styles.imageWrapper}>
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fit="contain"
                              className={styles.productImage}
                            />
                          </Box>
                        )}
                        <Box className={styles.productDetails}>
                          <Text size="sm" fw={500} lineClamp={2} className={styles.productTitle}>
                            {item.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </Text>
                        </Box>
                        <Box className={styles.priceSection}>
                          <Text size="sm" fw={600} ta="right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  ))}
                  
                  {order.items.length > 4 && (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                      rightSection={
                        expandedOrders[order.id] ? <IconChevronUp size={ICON_SIZES.SM} /> : <IconChevronDown size={ICON_SIZES.SM} />
                      }
                      fullWidth
                    >
                      {expandedOrders[order.id] 
                        ? 'Show Less' 
                        : `View ${order.items.length - 4} More Products`
                      }
                    </Button>
                  )}
                </Stack>

                <Group justify="space-between">
                  <Box>
                    <Text size="sm" c="dimmed">
                      Total Amount
                    </Text>
                    <Text fw={600} size="xl">
                      ${order.total.toFixed(2)}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed" ta="right">
                      Items
                    </Text>
                    <Text fw={600} size="xl" ta="right">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Text>
                  </Box>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
