import { UI_CONSTANTS } from '@/constants';
import { StepNavigationButtonsProps } from '@/types/checkout';
import { Box, Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { FC } from 'react';

export const StepNavigationButtons: FC<StepNavigationButtonsProps> = ({
  stepIndex,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
}) => {
  const isLastStep = stepIndex === totalSteps - 1;
  const isFirstStep = stepIndex === 0;

  return (
    <Group justify="space-between">
      <Box>
        {!isFirstStep && (
          <Button
            type="button"
            variant="default"
            leftSection={<IconArrowLeft size={UI_CONSTANTS.ICON_SIZES.SM} />}
            onClick={onPrevious}
          >
            Back
          </Button>
        )}
      </Box>
      <Group>
        {!isLastStep && (
          <Button
            type="button"
            rightSection={<IconArrowRight size={UI_CONSTANTS.ICON_SIZES.SM} />}
            onClick={onNext}
          >
            Continue
          </Button>
        )}
        {isLastStep && (
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            loaderProps={{ size: 'sm', color: 'white' }}
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </Button>
        )}
      </Group>
    </Group>
  );
};
