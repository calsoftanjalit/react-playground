import { PaymentInfoSectionProps } from '@/types/checkout';
import { formatCardNumber, formatExpiryDate } from '@/utils';
import { Grid, Stack, TextInput } from '@mantine/core';
import { IconCalendar, IconCreditCard, IconLock, IconUser } from '@tabler/icons-react';
import { FC } from 'react';

export const PaymentInfoSection: FC<PaymentInfoSectionProps> = ({ form }) => {
  return (
    <Stack gap="md">
      <TextInput
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        required
        maxLength={19}
        leftSection={<IconCreditCard size={16} />}
        {...form.getInputProps('cardNumber')}
        onChange={(event) => {
          const formatted = formatCardNumber(event.currentTarget.value);
          form.setFieldValue('cardNumber', formatted);
        }}
      />
      <TextInput
        label="Name on Card"
        placeholder="John Doe"
        required
        leftSection={<IconUser size={16} />}
        {...form.getInputProps('cardName')}
      />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Expiry Date"
            placeholder="MM/YY"
            required
            maxLength={5}
            leftSection={<IconCalendar size={16} />}
            {...form.getInputProps('expiryDate')}
            onChange={(event) => {
              const formatted = formatExpiryDate(event.currentTarget.value);
              form.setFieldValue('expiryDate', formatted);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="CVV"
            placeholder="123"
            type="password"
            required
            maxLength={4}
            leftSection={<IconLock size={16} />}
            {...form.getInputProps('cvv')}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
