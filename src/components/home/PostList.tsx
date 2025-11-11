import { useQuery } from '@tanstack/react-query';
import { Container, Stack, Title } from '@mantine/core';
import Post from './Post';
import { fetchPosts } from '@/services/postService';
import { ErrorMessage, LoadingIndicator } from '@/components/miscellaneous';

export const PostList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(4),
  });

  if (isLoading) return <LoadingIndicator />;
  if (error?.message) return <ErrorMessage message={error?.message} />;

  return (
    <>
      <Container size="sm" py="lg">
        <Title order={2} mb="md">
          Post List
        </Title>
        <Stack>
          {data &&
            data.map((post) => (
              <Post key={post.id} id={post.id} title={post.title} body={post.body} />
            ))}
        </Stack>
      </Container>
    </>
  );
};
