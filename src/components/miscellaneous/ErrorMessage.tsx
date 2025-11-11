import { Text } from '@mantine/core';
import { ErrorMessageInterface } from '@/types';

export const ErrorMessage: React.FC<ErrorMessageInterface> = ({ message }) => {
  if (!message) return null;
  return <Text c="red">{message}</Text>;
};
