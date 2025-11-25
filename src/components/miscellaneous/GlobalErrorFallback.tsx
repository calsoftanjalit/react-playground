import {
  Button,
  Container,
  Group,
  Paper,
  Text,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import React from "react";
import { FallbackProps } from "react-error-boundary";

export const GlobalErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Container size="md" py={80}>
      <Paper shadow="md" p="xl" radius="md" withBorder ta={"center"}>
        <ThemeIcon size={80} radius="100%" color="red" variant="light" mb="lg">
          <IconAlertTriangle size={40} />
        </ThemeIcon>

        <Title order={2} mb="md">
          Something went wrong
        </Title>
        <Text c="dimmed" mb="xl">
          We encountered an unexpected error.
        </Text>
        <Paper withBorder p="xs" bg="gray.0" mb="xl" ta={"center"}>
          <Text c="red" size="sm" className="monospace">
            {error.message}
          </Text>
        </Paper>
        <Group justify="center">
          <Button
            onClick={resetErrorBoundary}
            leftSection={<IconRefresh size={18} />}
            size="md"
          >
            Reload Application
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};
