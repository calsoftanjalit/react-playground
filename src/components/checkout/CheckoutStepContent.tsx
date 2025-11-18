import { Stack } from '@mantine/core';
import { FC, ReactNode } from 'react';
import { StepErrorAlert } from './StepErrorAlert';
import { StepProgress } from './StepProgress';

type StepState = 'idle' | 'completed' | 'error';

interface CheckoutStepContentProps {
  stepIndex: number;
  totalSteps: number;
  stepStatus: StepState;
  primaryColor: string;
  children: ReactNode;
  navigationButtons: ReactNode;
}

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
