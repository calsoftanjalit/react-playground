import { Card, Text } from '@mantine/core';
import { PostInterface } from '@types';

const Post: React.FC<PostInterface> = ({ id, title, body }) => {
  return (
    <>
      <Card key={id} shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} tt="capitalize">
          {title}
        </Text>
        <Text size="sm" mt="xs">
          {body}
        </Text>
      </Card>
    </>
  );
};

export default Post;
