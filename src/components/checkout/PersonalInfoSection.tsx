import { PersonalInfoSectionProps } from '@/types/checkout';
import { Grid, Stack, TextInput } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';
import { FC } from 'react';

export const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({ form }) => {
  return (
    <Stack gap="md">
      <TextInput
        label="Full Name"
        placeholder="John Doe"
        required
        leftSection={<IconUser size={16} />}
        {...form.getInputProps('fullName')}
      />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Email"
            placeholder="john@example.com"
            type="email"
            required
            leftSection={<IconMail size={16} />}
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Phone Number"
            placeholder="(555) 123-4567"
            required
            leftSection={<IconPhone size={16} />}
            {...form.getInputProps('phone')}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
