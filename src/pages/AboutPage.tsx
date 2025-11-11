import { Box, Container, Text } from "@mantine/core";
import { AboutHero, DevelopmentTimeline, TechStack } from "../components/about";

const AboutPage = () => {
  return (
    <Container size="md" className="py-8">
      <AboutHero />
      <TechStack />
      <DevelopmentTimeline />

      <Box className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <Text size="sm" c="dimmed" ta="center">
          🚀 Ready to build something amazing? Start exploring the playground!
        </Text>
      </Box>
    </Container>
  );
};

export default AboutPage;
