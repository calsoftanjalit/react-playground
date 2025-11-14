import { QuantitySelectorProps } from "@/types/quantitySelector";
import { Group, ActionIcon, Badge, Box } from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import React from "react";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  handleIncrement,
  handleDecrement,
}) => {
  return (
    <Box mt="md">
      <Group justify="center">
        <ActionIcon variant="light" size="lg" onClick={handleDecrement}>
          <IconMinus size={18} />
        </ActionIcon>

        <Badge variant="light" size="lg">
          {quantity}
        </Badge>

        <ActionIcon variant="light" size="lg" onClick={handleIncrement}>
          <IconPlus size={18} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default QuantitySelector;
