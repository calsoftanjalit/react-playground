import { StepProgressProps } from '@/types/checkout';
import { Badge, Group, Text } from '@mantine/core';
import { FC } from 'react';

export const StepProgress: FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  isCompleted,
  primaryColor,
}) => {
  return (
    <Group justify="space-between" align="center">
      <Text size="sm" c="dimmed">
        Step {currentStep} of {totalSteps}
      </Text>
      {isCompleted && (
        <Badge color={primaryColor} variant="light">
          Validated
        </Badge>
      )}
    </Group>
  );
};
