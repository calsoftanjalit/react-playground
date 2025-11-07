import {
  Text,
  SimpleGrid,
  Divider,
  Container,
  Stack,
  Box,
  Anchor,
} from "@mantine/core";

const footerLinks = [
  {
    title: "About Us",
    links: ["Our Story", "Careers", "Press"],
  },
  {
    title: "Customer Service",
    links: ["Contact Us", "Shipping & Returns", "FAQ"],
  },
  {
    title: "Shopping",
    links: ["New Arrivals", "Best Sellers", "Sale"],
  },
  {
    title: "Connect",
    links: ["Instagram", "Facebook", "Twitter"],
  },
];

export const Footer = () => {
  return (
    <Box bg="gray.0">
      <Container size="lg">
        <Box py={50}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={50}>
            {footerLinks.map((section) => (
              <Stack key={section.title} gap="xs">
                <Text fw={700} size="sm" tt="uppercase" mb={10}>
                  {section.title}
                </Text>
                {section.links.map((link) => (
                  <Anchor key={link} component="button" c="dimmed" size="sm">
                    {link}
                  </Anchor>
                ))}
              </Stack>
            ))}
          </SimpleGrid>
        </Box>
        <Divider />
        <Box py="md" ta="center">
          <Text size="sm" c="dimmed">
            © 2025 Your Brand Name. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};
