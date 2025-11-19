import { CheckoutStepContentProps } from '@/types/checkout';
import { Stack } from '@mantine/core';
import { FC } from 'react';
import { StepErrorAlert } from './StepErrorAlert';
import { StepProgress } from './StepProgress';

export const CheckoutStepContent: FC<CheckoutStepContentProps> = ({
  stepIndex,
  totalSteps,
  stepStatus,
  primaryColor,
  children,
  navigationButtons,
}) => {
  return (
    <Stack gap="lg">
      {children}
      <Stack gap="sm">
        <StepProgress
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          isCompleted={stepStatus === 'completed'}
          primaryColor={primaryColor}
        />
        {stepStatus === 'error' && <StepErrorAlert />}
        {navigationButtons}
      </Stack>
    </Stack>
  );
};
