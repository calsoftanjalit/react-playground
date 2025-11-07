import {
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Container,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import LoaderComponent from "../miscellaneous/Loader";
import ErrorMessage from "../miscellaneous/ErrorMessage";

// const products = [
//   { id: 1, name: "Premium Product 1", price: 99.99 },
//   { id: 2, name: "Premium Product 2", price: 149.99 },
//   { id: 3, name: "Premium Product 3", price: 79.99 },
//   { id: 4, name: "Premium Product 4", price: 129.99 },
// ];

export const PopularProducts = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(4)
  })
  
  if (isLoading) return <LoaderComponent />
  if (error?.message) return <ErrorMessage message={error?.message} />

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        Popular Products
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {data && data.map((post) => (
          <Card
            key={post.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text fw={500} size="lg" mt="md">
              {post.title}
            </Text>
            {/* <Button variant="light" fullWidth mt="md">
              Add to Cart
            </Button> */}
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};
