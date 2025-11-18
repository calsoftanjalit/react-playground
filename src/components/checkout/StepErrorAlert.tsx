import { UI_CONSTANTS } from '@/constants';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { FC } from 'react';

interface StepErrorAlertProps {
  message?: string;
}

export const StepErrorAlert: FC<StepErrorAlertProps> = ({
  message = 'Please fix the highlighted fields before continuing.',
}) => {
  return (
    <Alert
      variant="light"
      color="red"
      radius="md"
      icon={<IconAlertCircle size={UI_CONSTANTS.ICON_SIZES.SM} />}
    >
      {message}
    </Alert>
  );
};
