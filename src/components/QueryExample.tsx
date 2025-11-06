import { Card, Text, Loader } from "@mantine/core";
import { useUsers } from "../hooks";
import type { User } from "../types";

export const QueryExample = () => {
  const { data, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
        <div className="flex justify-center items-center p-4">
          <Loader size="md" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
        <Text c="red">Error loading users. Please try again later.</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Text size="lg" fw={500} mb="md">
        React Query Example
      </Text>
      <div className="space-y-2">
        {data?.map((user: User) => (
          <div
            key={user.id}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <Text size="sm" fw={500}>
              {user.name}
            </Text>
            <Text size="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};
