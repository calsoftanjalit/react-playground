import React from 'react';
import { TextInput, Button, Modal, Title, Group, Text, Alert } from '@mantine/core';
import { useInputState, useDisclosure } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import styles from '@/styles/coupon.module.scss';
interface ApplyCouponProps {
  onApplyCoupon: (code: string) => { isValid: boolean; message: string };
  appliedCoupon?: { code: string } | null;
  onRemoveCoupon?: () => void;
}

export default function ApplyCoupon({
  onApplyCoupon,
  appliedCoupon,
  onRemoveCoupon,
}: ApplyCouponProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [couponCode, setCouponCode] = useInputState('');
  const [validationResult, setValidationResult] = React.useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleValidate = () => {
    const result = onApplyCoupon(couponCode);
    setValidationResult(result);

    if (result.isValid) {
      setTimeout(() => {
        close();
        setCouponCode('');
        setValidationResult(null);
      }, 1500);
    }
  };

  const handleRemove = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
      setValidationResult(null);
    }
  };

  const handleModalClose = () => {
    close();
    setValidationResult(null);
    setCouponCode('');
  };

  return (
    <>
      {appliedCoupon ? (
        <Group className={styles.couponAppliedContainer} justify="space-between" mb="md" p="xs">
          <Group gap="xs">
            <IconCheck size={16} color="green" />
            <Text size="sm" fw={500}>
              Coupon Applied: {appliedCoupon.code}
            </Text>
          </Group>
          <Button size="xs" variant="subtle" color="red" onClick={handleRemove}>
            Remove
          </Button>
        </Group>
      ) : (
        <Button onClick={open} variant="light" fullWidth mb="md">
          Have a Coupon Code?
        </Button>
      )}

      <Modal
        opened={opened}
        onClose={handleModalClose}
        title={<Title order={3}>Apply Coupon Code</Title>}
        centered
      >
        <TextInput
          label="Coupon Code"
          placeholder="Enter your coupon code"
          value={couponCode}
          onChange={setCouponCode}
          size="md"
          mb="md"
          classNames={{
            input: styles.couponInput,
          }}
        />

        {validationResult && (
          <Alert
            icon={validationResult.isValid ? <IconCheck size={16} /> : <IconX size={16} />}
            color={validationResult.isValid ? 'green' : 'red'}
            mb="md"
          >
            {validationResult.message}
          </Alert>
        )}

        <Group mt="md" justify="flex-end">
          <Button variant="subtle" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button onClick={handleValidate} disabled={!couponCode.trim()}>
            Apply Coupon
          </Button>
        </Group>
      </Modal>
    </>
  );
}
