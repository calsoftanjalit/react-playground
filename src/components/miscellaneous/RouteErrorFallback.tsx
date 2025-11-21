import { Button, Container, Group, Text, Title, Stack } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

export const RouteErrorFallback: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let title = "System Error";
  let message = "Something went wrong loading this page.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message =
        "The page you are looking for does not exist or has been moved.";
    } else if (error.status === 401) {
      title = "Unauthorized";
      message = "You do not have permission to view this page.";
    }
  }

  return (
    <Container size="md" py={80}>
      <Stack align="center" gap="md">
        <Title order={1} c="blue.6" fz="3rem">
          {isRouteErrorResponse(error) ? error.status : "Oops!"}
        </Title>
        <Title order={2}>{title}</Title>
        <Text c="dimmed" ta="center" maw={500}>
          {message}
        </Text>

        <Group mt="lg">
          <Button variant="default" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            leftSection={<IconHome size={18} />}
          >
            Back to Home
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};
