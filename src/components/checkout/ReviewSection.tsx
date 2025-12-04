import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCreditCard,
  IconTruck,
  IconUser,
} from '@tabler/icons-react';

import type { ReviewSectionProps } from '@/types/checkout';
import { UI_CONSTANTS } from '@/constants';

export const ReviewSection = ({ form }: ReviewSectionProps) => {
  const { fullName, email, phone, address, city, state, zipCode, country, cardNumber, cardName, expiryDate } = form.values;

  return (
    <Stack gap="lg">
      <Box>
        <Text size="sm" c="dimmed" mb="md">
          Please review your order details before confirming
        </Text>
      </Box>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Group gap="sm">
            <IconUser size={UI_CONSTANTS.ICON_SIZES.LG} />
            <Title order={4}>Contact Information</Title>
          </Group>
          <Divider />
          <Stack gap="sm">
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Name:
              </Text>
              <Text size="sm">{fullName || '-'}</Text>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Email:
              </Text>
              <Text size="sm">{email || '-'}</Text>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Phone:
              </Text>
              <Text size="sm">{phone || '-'}</Text>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Group gap="sm">
            <IconTruck size={UI_CONSTANTS.ICON_SIZES.LG} />
            <Title order={4}>Shipping Address</Title>
          </Group>
          <Divider />
          <Group gap="sm" wrap="nowrap">
            <Text size="sm" fw={500} c="dimmed" w={100}>
              Address:
            </Text>
            <Text size="sm">
              {[address, city, state, zipCode, country].filter(Boolean).join(', ') || '-'}
            </Text>
          </Group>
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Group gap="sm">
            <IconCreditCard size={UI_CONSTANTS.ICON_SIZES.LG} />
            <Title order={4}>Payment Method</Title>
          </Group>
          <Divider />
          <Stack gap="sm">
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Card Number:
              </Text>
              <Group gap="xs" align="center">
                <Text size="sm" ff="monospace">
                  {cardNumber || '-'}
                </Text>
                {cardNumber && (
                  <Badge size="xs" color="blue" variant="light">
                    Secure
                  </Badge>
                )}
              </Group>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Cardholder:
              </Text>
              <Text size="sm">{cardName || '-'}</Text>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" fw={500} c="dimmed" w={100}>
                Expiry:
              </Text>
              <Text size="sm" ff="monospace">
                {expiryDate || '-'}
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Box>
        <Text size="xs" c="dimmed" ta="center">
          🔒 Your payment information is encrypted and secure
        </Text>
      </Box>
    </Stack>
  );
};
