import { Card, Text, Timeline, Title } from "@mantine/core";
import {
  IconCheck,
  IconCode,
  IconGitBranch,
  IconRocket,
} from "@tabler/icons-react";

export const DevelopmentTimeline = () => {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Title order={2} className="mb-6">
        Development Timeline
      </Title>
      <Timeline active={3} bulletSize={24} lineWidth={2}>
        <Timeline.Item bullet={<IconRocket size={12} />} title="Project Setup">
          <Text c="dimmed" size="sm">
            Initialized with Vite, React, and TypeScript
          </Text>
          <Text size="xs" mt={4} c="dimmed">
            Configuration and dependencies
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconCode size={12} />} title="UI Integration">
          <Text c="dimmed" size="sm">
            Added Mantine UI and Tailwind CSS
          </Text>
          <Text size="xs" mt={4} c="dimmed">
            Component library and styling
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Data Management"
          bullet={<IconGitBranch size={12} />}
        >
          <Text c="dimmed" size="sm">
            Integrated TanStack Query for data fetching
          </Text>
          <Text size="xs" mt={4} c="dimmed">
            State management and caching
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Routing & Navigation"
          bullet={<IconCheck size={12} />}
        >
          <Text c="dimmed" size="sm">
            Implemented React Router with Mantine layout
          </Text>
          <Text size="xs" mt={4} c="dimmed">
            Full navigation system
          </Text>
        </Timeline.Item>
      </Timeline>
    </Card>
  );
};
