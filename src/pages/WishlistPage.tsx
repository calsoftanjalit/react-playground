import Product from '@/components/home/Product';
import { useWishlistStore } from '@/hooks/useWishlistStore';
import { ROUTE_PATHS } from '@/routes';
import styles from '@/styles/WishlistPage.module.scss';
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconHeart, IconShoppingBag, IconTrash } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlistStore();

  if (wishlist.length === 0) {
    return (
      <Container size="lg" py={80}>
        <Paper p="xl" radius="lg" withBorder className={styles.emptyStatePaper}>
          <Center className={styles.emptyStateCenter} py={60}>
            <ThemeIcon size={80} radius="50%" variant="light" color="gray">
              <IconHeart size={40} stroke={1.5} />
            </ThemeIcon>
            <Stack gap="xs" align="center">
              <Title order={2} fw={800}>
                Your Wishlist is Empty
              </Title>
              <Text c="dimmed" size="lg" ta="center" maw={400}>
                Looks like you haven't added anything to your wishlist yet. Explore our products and
                save your favorites!
              </Text>
            </Stack>
            <Button
              component={Link}
              to={ROUTE_PATHS.HOME}
              variant="filled"
              size="lg"
              color="dark"
              radius="md"
              leftSection={<IconShoppingBag size={20} />}
            >
              Start Shopping
            </Button>
          </Center>
        </Paper>
      </Container>
    );
  }

  return (
    <Box pb={80}>
      <Box bg="gray.0" py={60} mb={40}>
        <Container size="lg">
          <Group justify="space-between" align="flex-end">
            <Stack gap="xs" align="flex-start">
              <Title order={1} fw={900} className={styles.heroTitle}>
                My Wishlist
              </Title>
              <Text c="dimmed" size="xl">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
              </Text>
            </Stack>
            <Button
              variant="subtle"
              color="red"
              leftSection={<IconTrash size={18} />}
              onClick={clearWishlist}
            >
              Clear Wishlist
            </Button>
          </Group>
        </Container>
      </Box>

      <Container size="lg">
        <Grid gutter="xl">
          {wishlist.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Product {...product} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WishlistPage;
