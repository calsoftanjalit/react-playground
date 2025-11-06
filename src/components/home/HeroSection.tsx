import {
  Title,
  Text,
  Button,
  Group,
  Badge,
  Container,
  Stack,
  Box,
} from "@mantine/core";

export const HeroSection = () => {
  return (
    <Box bg="gray.0">
      <Container size="lg">
        <Stack align="center" justify="center" py={60} gap="lg">
          <Badge
            variant="filled"
            size="lg"
            color="blue"
            style={{ transform: "translateY(8px)" }}
          >
            NEW COLLECTION AVAILABLE
          </Badge>

          <Title
            order={1}
            size={48}
            ta="center"
            style={{
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            Discover Your Perfect Style
          </Title>

          <Text
            size="xl"
            c="dimmed"
            maw={600}
            ta="center"
            style={{ lineHeight: 1.6 }}
          >
            Explore our latest collection of premium products designed for your
            lifestyle.
          </Text>

          <Group justify="center" gap="md" mt="md">
            <Button
              size="lg"
              variant="filled"
              color="blue"
              radius="md"
              style={{
                paddingLeft: 32,
                paddingRight: 32,
              }}
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="light"
              radius="md"
              style={{
                paddingLeft: 32,
                paddingRight: 32,
              }}
            >
              Learn More
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};
