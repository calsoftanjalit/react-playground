import { Title, Text, SimpleGrid, Card, Container } from "@mantine/core";

const categories = [
  {
    title: "Premium Collection",
    description: "Discover luxury items crafted for excellence",
  },
  {
    title: "New Arrivals",
    description: "Shop the latest trends and styles",
  },
  {
    title: "Best Sellers",
    description: "Our most popular items chosen by customers",
  },
];

export const FeaturedCategories = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Featured Categories
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {categories.map((category) => (
          <Card
            key={category.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text size="lg" fw={500} mb="sm">
              {category.title}
            </Text>
            <Text size="sm" c="dimmed">
              {category.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};
