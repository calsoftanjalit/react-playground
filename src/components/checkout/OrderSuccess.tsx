import { UI_CONSTANTS } from '@/constants/checkout';
import classes from '@/styles/OrderSuccess.module.scss';
import { OrderSuccessProps } from '@/types/checkout';
import { calculatePricingFromItems } from '@/utils/checkout';
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCheck,
  IconCreditCard,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPrinter,
  IconReceipt,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const OrderSuccess: FC<OrderSuccessProps> = ({ orderSummary }) => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  const pricing = calculatePricingFromItems(orderSummary.items);
  const { subtotal, tax, shipping, total } = pricing;

  return (
    <Box
      className={`${classes.container} ${colorScheme === 'light' ? classes.containerLight : ''}`}
    >
      <Stack gap="xl" maw={1200} mx="auto">
        <Paper
          shadow="md"
          p={{ base: 'lg', sm: 'xl' }}
          radius="lg"
          withBorder
          className={classes.successHeader}
        >
          <Box className={classes.successIconWrapper}>
            <Box className={classes.successIcon}>
              <IconCheck
                size={UI_CONSTANTS.ICON_SIZES.XXL}
                color={UI_CONSTANTS.COLORS.WHITE}
                stroke={UI_CONSTANTS.ICON_STROKE.EXTRA_BOLD}
              />
            </Box>
          </Box>
          <Title order={1} mb="sm" size="h2">
            Order Placed Successfully!
          </Title>
          <Text c="dimmed" size="lg" mb="md">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </Text>
          <Group justify="center" gap="md" mt="xl">
            <Button
              variant="light"
              size="md"
              leftSection={<IconPrinter size={18} />}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            <Button
              variant="filled"
              size="md"
              leftSection={<IconShoppingBag size={18} />}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Group>
        </Paper>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper shadow="md" p="xl" radius="lg" withBorder mb="lg">
              <Group mb="lg" gap="sm">
                <IconReceipt size={28} stroke={1.5} />
                <Title order={2} size="h3">
                  Order Details
                </Title>
              </Group>

              <Stack gap="md">
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <IconPackage size={20} />
                    <Text fw={500}>Order ID:</Text>
                  </Group>
                  <Text c="dimmed" className={classes.orderIdText}>
                    {orderSummary.orderId}
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <IconUser size={20} />
                    <Text fw={500}>Customer Name:</Text>
                  </Group>
                  <Text c="dimmed">{orderSummary.fullName}</Text>
                </Group>

                <Divider />

                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <IconMail size={20} />
                    <Text fw={500}>Email:</Text>
                  </Group>
                  <Anchor href={`mailto:${orderSummary.email}`} c="dimmed" underline="hover">
                    {orderSummary.email}
                  </Anchor>
                </Group>

                <Divider />

                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <Group gap="sm" align="flex-start">
                    <Box mt={2}>
                      <IconMapPin size={UI_CONSTANTS.ICON_SIZES.LG} />
                    </Box>
                    <Text fw={500}>Shipping Address:</Text>
                  </Group>
                  <Text c="dimmed" className={classes.addressText}>
                    {orderSummary.address}
                  </Text>
                </Group>

                <Divider />

                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <IconCreditCard size={UI_CONSTANTS.ICON_SIZES.LG} />
                    <Text fw={500}>Order Date:</Text>
                  </Group>
                  <Text c="dimmed">{orderSummary.orderDate}</Text>
                </Group>
              </Stack>
            </Paper>

            <Paper shadow="md" p="xl" radius="lg" withBorder>
              <Title order={2} size="h3" mb="lg">
                Order Items ({orderSummary.items.length})
              </Title>

              <Stack gap="md">
                {orderSummary.items.map((item) => (
                  <Paper
                    key={item.id}
                    p="md"
                    radius="md"
                    withBorder
                    className={`${classes.itemCard} ${colorScheme === 'light' ? classes.itemCardLight : classes.itemCardDark}`}
                  >
                    <Group wrap="nowrap" align="flex-start" gap="md">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          w={80}
                          h={80}
                          radius="md"
                          fit="cover"
                          fallbackSrc="https://placehold.co/80x80?text=No+Image"
                        />
                      ) : (
                        <Avatar size={80} radius="md" color="blue">
                          <IconPackage size={40} />
                        </Avatar>
                      )}

                      <Box className={classes.itemDetails}>
                        <Group justify="space-between" align="flex-start" mb="xs">
                          <Box>
                            <Text fw={600} size="lg" lineClamp={2}>
                              {item.name}
                            </Text>
                            <Text c="dimmed" size="sm" mt={4}>
                              ${item.price.toFixed(2)} each
                            </Text>
                          </Box>
                        </Group>
                        <Group justify="space-between" mt="sm">
                          <Text size="sm" c="dimmed">
                            Quantity: {item.quantity}
                          </Text>
                          <Text fw={600} size="lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper shadow="md" p="xl" radius="lg" withBorder className={classes.summaryCard}>
              <Title order={2} size="h3" mb="lg">
                Order Summary
              </Title>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text>Subtotal:</Text>
                  <Text fw={500}>${subtotal.toFixed(2)}</Text>
                </Group>

                <Group justify="space-between">
                  <Text>Shipping:</Text>
                  <Text fw={500} c={shipping === 0 ? 'green' : undefined}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text>Tax (9%):</Text>
                  <Text fw={500}>${tax.toFixed(2)}</Text>
                </Group>

                <Divider my="sm" />

                <Group justify="space-between">
                  <Text fw={700} size="xl">
                    Total:
                  </Text>
                  <Text fw={700} size="xl" c="blue">
                    ${total.toFixed(2)}
                  </Text>
                </Group>

                <Divider my="sm" />

                <Box
                  className={`${classes.whatsNextBox} ${colorScheme === 'light' ? classes.whatsNextBoxLight : classes.whatsNextBoxDark}`}
                >
                  <Title order={4} size="h5" mb="sm">
                    What's Next?
                  </Title>
                  <Stack gap="xs">
                    <Text size="sm">✓ Confirmation email sent</Text>
                    <Text size="sm">✓ Track order in "My Orders"</Text>
                    <Text size="sm">✓ Delivery in 3-5 business days</Text>
                  </Stack>
                </Box>

                <Stack gap="xs" mt="md">
                  <Group gap="xs" className={classes.trustBadge}>
                    <IconCheck
                      size={UI_CONSTANTS.ICON_SIZES.SM}
                      color={UI_CONSTANTS.COLORS.SUCCESS}
                    />
                    <Text size="xs" c="dimmed">
                      Secure payment
                    </Text>
                  </Group>
                  <Group gap="xs" className={classes.trustBadge}>
                    <IconCheck
                      size={UI_CONSTANTS.ICON_SIZES.SM}
                      color={UI_CONSTANTS.COLORS.SUCCESS}
                    />
                    <Text size="xs" c="dimmed">
                      Money-back guarantee
                    </Text>
                  </Group>
                  <Group gap="xs" className={classes.trustBadge}>
                    <IconCheck
                      size={UI_CONSTANTS.ICON_SIZES.SM}
                      color={UI_CONSTANTS.COLORS.SUCCESS}
                    />
                    <Text size="xs" c="dimmed">
                      24/7 customer support
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
};
