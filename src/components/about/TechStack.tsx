import { Badge, Card, Group, Text, Title } from "@mantine/core";

export const TechStack = () => {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="mb-8">
      <Title order={2} className="mb-4">
        Project Overview
      </Title>
      <Text c="dimmed" className="mb-4">
        This React Playground is built with a carefully selected stack of modern
        tools and libraries to provide the best development experience possible.
      </Text>

      <div className="mt-6 space-y-4">
        <div>
          <Text fw={600} className="mb-2">
            🎨 UI & Styling
          </Text>
          <Group gap="xs">
            <Badge variant="light" color="blue">
              Mantine UI
            </Badge>
            <Badge variant="light" color="cyan">
              Tailwind CSS
            </Badge>
            <Badge variant="light" color="pink">
              SCSS Modules
            </Badge>
          </Group>
        </div>

        <div>
          <Text fw={600} className="mb-2">
            ⚡ Build Tools
          </Text>
          <Group gap="xs">
            <Badge variant="light" color="violet">
              Vite
            </Badge>
            <Badge variant="light" color="blue">
              TypeScript
            </Badge>
            <Badge variant="light" color="orange">
              PostCSS
            </Badge>
          </Group>
        </div>

        <div>
          <Text fw={600} className="mb-2">
            🔧 Development
          </Text>
          <Group gap="xs">
            <Badge variant="light" color="green">
              TanStack Query
            </Badge>
            <Badge variant="light" color="red">
              Vitest
            </Badge>
            <Badge variant="light" color="yellow">
              ESLint
            </Badge>
          </Group>
        </div>
      </div>
    </Card>
  );
};
