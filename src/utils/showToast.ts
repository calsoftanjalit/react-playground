import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';
import React from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ShowToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  autoClose?: number | boolean;
}

const iconMap = {
  success: IconCheck,
  error: IconX,
  warning: IconExclamationCircle,
  info: IconInfoCircle,
} as const;

const colorMap = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
} as const;

export const showToast = ({
  title,
  message,
  type = 'info',
  autoClose = 4000,
}: ShowToastOptions): void => {
  const IconComponent = iconMap[type];
  const color = colorMap[type];

  notifications.show({
    title: title || type.charAt(0).toUpperCase() + type.slice(1),
    message,
    color,
    icon: React.createElement(IconComponent, { size: 20 }),
    autoClose,
  });
};
