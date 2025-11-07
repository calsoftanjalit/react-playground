import { Badge, Text, Title } from "@mantine/core";

export const AboutHero = () => {
  return (
    <div className="text-center mb-12">
      <Badge size="lg" variant="dot" className="mb-4">
        About This Project
      </Badge>
      <Title order={1} className="mb-4 text-4xl">
        React Playground
      </Title>
      <Text size="lg" c="dimmed" className="mb-8">
        A comprehensive development environment for modern React applications
      </Text>
    </div>
  );
};
