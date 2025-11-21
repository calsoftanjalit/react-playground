import { Button, Container, Group, Paper, Text, Title, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'; 
import { FallbackProps } from 'react-error-boundary';

export const GlobalErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Container size="md" py={80}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
        <ThemeIcon size={80} radius="100%" color="red" variant="light" mb="lg">
          <IconAlertTriangle size={40} />
        </ThemeIcon>
        
        <Title order={2} mb="md">Something went wrong</Title>
        <Text c="dimmed" mb="xl">
          We encountered an unexpected error. 
        </Text>
         <Paper withBorder p="xs" bg="gray.0" mb="xl" style={{ textAlign: 'left' }}>
             <Text c="red" size="sm" style={{ fontFamily: 'monospace' }}>{error.message}</Text>
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

