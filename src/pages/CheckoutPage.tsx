import { CheckoutForm, OrderSuccess, OrderSummaryCard } from '@/components/checkout';
import { useCartStore } from '@/context';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { ROUTE_PATHS } from '@/routes';
import classes from '@/styles/CheckoutPage.module.scss';
import { CartItem } from '@/types/cart';
import { CheckoutCart, OrderSummary } from '@/types/checkout';
import { calculatePricing } from '@/utils';
import {
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLock, IconShieldCheck, IconShoppingCartOff } from '@tabler/icons-react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const CheckoutPage: FC = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const { items: cartItems, clearCart, updateItem } = useCartStore();
  const { clearFormData } = useCheckoutFormContext();
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  const buyNowItem = location.state?.buyNowItem as CartItem | undefined;

  const [localItems, setLocalItems] = useState<CartItem[]>(
    buyNowItem ? [buyNowItem] : cartItems
  );

  useEffect(() => {
    if (!hasInitialized.current) {
      clearFormData();
      hasInitialized.current = true;
    }
  }, [clearFormData]);

  useEffect(() => {
    if (!buyNowItem) {
      setLocalItems(cartItems);
    }
  }, [cartItems, buyNowItem]);

  const checkoutCart: CheckoutCart = useMemo(
    () => ({
      items: localItems,
      pricing: calculatePricing(localItems, 0),
    }),
    [localItems]
  );

  const handleCartUpdate = (updatedCart: CheckoutCart) => {
    setLocalItems(updatedCart.items);

    if (!buyNowItem) {
      updatedCart.items.forEach((item) => {
        updateItem(item.id, item.quantity);
      });
    }
  };

  useEffect(() => {
    if (localItems.length === 0 && !orderSummary) {
      const timer = setTimeout(() => {
        if (!orderSummary) {
          navigate(ROUTE_PATHS.CART);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [localItems.length, navigate, orderSummary]);

  const handleSubmitSuccess = (summary: OrderSummary) => {
    setOrderSummary(summary);
    if (!buyNowItem) {
      clearCart();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (localItems.length === 0 && !orderSummary) {
    return (
      <Box
        className={`${classes.emptyCartContainer} ${colorScheme === 'light' ? classes.emptyCartContainerLight : ''}`}
      >
        <Paper shadow="md" p="xl" radius="lg" withBorder maw={600} mx="auto" mt="xl">
          <Stack align="center" gap="lg">
            <IconShoppingCartOff size={64} stroke={1.5} className={classes.emptyCartIcon} />
            <Title order={2}>Your cart is empty</Title>
            <Text c="dimmed" ta="center">
              Add some items to your cart before proceeding to checkout
            </Text>
            <Button size="lg" onClick={() => navigate(ROUTE_PATHS.HOME)} fullWidth>
              Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      className={`${classes.container} ${colorScheme === 'light' ? classes.containerLight : ''}`}
    >
      {!orderSummary ? (
        <Grid gutter={{ base: 'md', lg: 'md' }} className={classes.checkoutGrid}>
          <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            <Stack gap="md">
              <Paper shadow="md" p={{ base: 'md', sm: 'lg', lg: 'xl' }} radius="lg" withBorder>
                <Group justify="space-between" wrap="wrap" align="center">
                  <Box className={classes.headerSection}>
                    <Title order={1} mb="xs">
                      Secure Checkout
                    </Title>
                    <Text c="dimmed" size="md">
                      Complete your purchase in just a few steps
                    </Text>
                  </Box>
                  <Group gap="sm" wrap="wrap">
                    <Badge
                      size="lg"
                      variant="light"
                      color="green"
                      leftSection={<IconShieldCheck size={16} />}
                    >
                      SSL Secured
                    </Badge>
                    <Badge
                      size="lg"
                      variant="light"
                      color="blue"
                      leftSection={<IconLock size={16} />}
                    >
                      Safe Payment
                    </Badge>
                  </Group>
                </Group>
              </Paper>

              <Paper shadow="md" p={{ base: 'md', sm: 'lg', lg: 'xl' }} radius="lg" withBorder>
                <CheckoutForm cartItems={localItems} onSubmitSuccess={handleSubmitSuccess} />
              </Paper>

              <Paper shadow="md" p={{ base: 'md', sm: 'lg', lg: 'xl' }} radius="lg" withBorder>
                <Group justify="center" gap="xl" wrap="wrap">
                  <Text size="sm" c="dimmed" ta="center">
                    🔒 256-bit SSL
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    ✓ Money-back
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    🚚 Free shipping
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    📞 24/7 Support
                  </Text>
                </Group>
              </Paper>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5, lg: 4 }} className={classes.rightColumn}>
            <OrderSummaryCard cart={checkoutCart} isSticky onCartUpdate={handleCartUpdate} />
          </Grid.Col>
        </Grid>
      ) : (
        <OrderSuccess orderSummary={orderSummary} />
      )}
    </Box>
  );
};

export default CheckoutPage;
