import { Divider, Grid, Stack, TextInput, Title } from '@mantine/core';
import {
  IconBuilding,
  IconHome,
  IconLocation,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';

import type { ShippingInfoSectionProps } from '@/types/checkout';
import { UI_CONSTANTS } from '@/constants';

export const ShippingInfoSection = ({ form }: ShippingInfoSectionProps) => {
  return (
    <Stack gap="xl">
      <Stack gap="md">
        <Title order={3} size="h4">
          Contact Information
        </Title>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          leftSection={<IconUser size={UI_CONSTANTS.ICON_SIZES.SM} />}
          {...form.getInputProps('fullName')}
        />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Email"
              placeholder="john@example.com"
              type="email"
              required
              leftSection={<IconMail size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('email')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Phone Number"
              placeholder="(555) 123-4567"
              required
              leftSection={<IconPhone size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('phone')}
            />
          </Grid.Col>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap="md">
        <Title order={3} size="h4">
          Delivery Address
        </Title>
        <TextInput
          label="Street Address"
          placeholder="123 Main Street"
          required
          leftSection={<IconHome size={UI_CONSTANTS.ICON_SIZES.SM} />}
          {...form.getInputProps('address')}
        />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="City"
              placeholder="New York"
              required
              leftSection={<IconBuilding size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('city')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="State/Province"
              placeholder="NY"
              required
              leftSection={<IconLocation size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('state')}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="ZIP/Postal Code"
              placeholder="10001"
              required
              leftSection={<IconMapPin size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('zipCode')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Country"
              placeholder="United States"
              required
              leftSection={<IconWorld size={UI_CONSTANTS.ICON_SIZES.SM} />}
              {...form.getInputProps('country')}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Stack>
  );
};
