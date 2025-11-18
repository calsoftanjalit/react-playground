import { Badge, Group, Text } from '@mantine/core';
import { FC } from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  primaryColor: string;
}

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
