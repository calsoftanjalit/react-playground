import { ShippingAddressSectionProps } from '@/types/checkout';
import { Grid, Stack, TextInput } from '@mantine/core';
import { IconBuilding, IconHome, IconLocation, IconMapPin, IconWorld } from '@tabler/icons-react';
import { FC } from 'react';

export const ShippingAddressSection: FC<ShippingAddressSectionProps> = ({ form }) => {
  return (
    <Stack gap="md">
      <TextInput
        label="Street Address"
        placeholder="123 Main Street"
        required
        leftSection={<IconHome size={16} />}
        {...form.getInputProps('address')}
      />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="City"
            placeholder="New York"
            required
            leftSection={<IconBuilding size={16} />}
            {...form.getInputProps('city')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="State/Province"
            placeholder="NY"
            required
            leftSection={<IconLocation size={16} />}
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
            leftSection={<IconMapPin size={16} />}
            {...form.getInputProps('zipCode')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Country"
            placeholder="United States"
            required
            leftSection={<IconWorld size={16} />}
            {...form.getInputProps('country')}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
