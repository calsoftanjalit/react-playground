import { Button, Card, Text } from '@mantine/core';
import styles from './ExampleComponent.module.scss';

interface ExampleComponentProps {
  title: string;
  description: string;
}

export const ExampleComponent = ({ title, description }: ExampleComponentProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <button className={styles.button}>SCSS Module Button</button>
    </div>
  );
};

export const MantineExample = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Text size="lg" fw={500} mb="xs">
        Mantine UI Example
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        This is a Mantine Card component demonstrating the UI library integration.
      </Text>
      <Button variant="filled" fullWidth>
        Mantine Button
      </Button>
    </Card>
  );
};
