import { Alert, Box, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
  IconLock,
  IconShieldCheck,
  IconTruck,
} from '@tabler/icons-react';

import type { ConfirmationSectionProps } from '@/types/checkout';
import { UI_CONSTANTS } from '@/constants';
import { formatPrice } from '@/utils/formatters';
import styles from '@/styles/ConfirmationSection.module.scss';

export const ConfirmationSection = ({ form, totalPrice }: ConfirmationSectionProps) => {
  const { fullName, email } = form.values;

  return (
    <Stack gap="lg" align="center">
      <Box className={styles.container}>
        <Title order={3} mb="xs" ta="center">
          You're almost done!
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          Review the details below and click "Complete Order" to finalize your purchase
        </Text>
      </Box>

      <Alert
        icon={<IconCircleCheck size={UI_CONSTANTS.ICON_SIZES.LG} />}
        title="Order Summary"
        color="blue"
        variant="light"
        className={styles.container}
        p="xs"
      >
        <Stack gap="xs" align="flex-start">
          <Text size="sm">
            <strong>Recipient:</strong> {fullName}
          </Text>
          <Text size="sm">
            <strong>Confirmation Email:</strong> {email}
          </Text>
          <Text size="sm">
            <strong>Order Total:</strong> ${formatPrice(totalPrice)}
          </Text>
        </Stack>
      </Alert>

      <Box className={styles.listWrapper}>
        <Title order={4} mb="sm" ta="center">
          What happens next?
        </Title>
        <List
          spacing="sm"
          size="sm"
          className={styles.listContent}
          icon={
            <ThemeIcon color="green" size={UI_CONSTANTS.ICON_SIZES.LG} radius="xl">
              <IconCheck size={UI_CONSTANTS.ICON_SIZES.XS} />
            </ThemeIcon>
          }
        >
          <List.Item>
            <strong>Instant confirmation</strong> - You'll receive an order confirmation email
            immediately
          </List.Item>
          <List.Item>
            <strong>Fast processing</strong> - Your order will be processed within 1-2 business
            days
          </List.Item>
          <List.Item>
            <strong>Secure shipping</strong> - Track your package every step of the way
          </List.Item>
          <List.Item>
            <strong>Easy returns</strong> - 30-day return policy on all items
          </List.Item>
        </List>
      </Box>

      <Stack gap="xs" align="center" className={styles.alertsContainer}>
        <Alert icon={<IconShieldCheck size={UI_CONSTANTS.ICON_SIZES.MD} />} color="green" variant="light" className={styles.container} p="xs">
          <Text size="sm" ta="left">
            <strong>Secure Payment:</strong> Your payment information is encrypted with 256-bit SSL
            security
          </Text>
        </Alert>

        <Alert icon={<IconTruck size={UI_CONSTANTS.ICON_SIZES.MD} />} color="blue" variant="light" className={styles.container} p="xs">
          <Text size="sm" ta="left">
            <strong>Free Shipping:</strong> Enjoy free standard shipping on orders over $500
          </Text>
        </Alert>

        <Alert icon={<IconLock size={UI_CONSTANTS.ICON_SIZES.MD} />} color="cyan" variant="light" className={styles.container} p="xs">
          <Text size="sm" ta="left">
            <strong>Privacy Protected:</strong> We never share your personal information with third
            parties
          </Text>
        </Alert>

        <Alert icon={<IconInfoCircle size={UI_CONSTANTS.ICON_SIZES.MD} />} color="gray" variant="light" className={styles.container} p="xs">
          <Text size="xs" ta="left">
            By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy.
            You'll be charged ${formatPrice(totalPrice)} for this order.
          </Text>
        </Alert>
      </Stack>
    </Stack>
  );
};
