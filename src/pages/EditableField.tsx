import { ReactNode } from "react";
import { Group, Box, Text, TextInput, TextInputProps } from "@mantine/core";

interface EditableFieldProps {
  icon: ReactNode;
  label: string;
  isEditing: boolean;
  /** Shown when not editing */
  displayValue: ReactNode;
  /** For single input fields */
  inputProps?: TextInputProps;
  /** For composite fields like First + Last name */
  renderInputs?: () => ReactNode;
  className?: string;
}

export const EditableField = ({
  icon,
  label,
  isEditing,
  displayValue,
  inputProps,
  renderInputs,
  className,
}: EditableFieldProps) => {
  return (
    <Group gap="sm" align="flex-start">
      {icon}
      <Box className={className}>
        <Text size="sm" c="dimmed" ta="left">
          {label}
        </Text>

        {isEditing ? (
          renderInputs ? (
            renderInputs()
          ) : (
            <TextInput {...inputProps} />
          )
        ) : (
          <Text fw={500} ta="left">
            {displayValue}
          </Text>
        )}
      </Box>
    </Group>
  );
};
