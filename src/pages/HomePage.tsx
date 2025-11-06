import { Container, Title, Text } from "@mantine/core";
import { QueryExample } from "../components";

export const HomePage = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        React Playground
      </Title>
      <Text size="lg" mb={24}>
        Vite + React + TypeScript + Mantine + TanStack Query + Tailwind CSS +
        SCSS
      </Text>
      <QueryExample />
    </Container>
  );
};
