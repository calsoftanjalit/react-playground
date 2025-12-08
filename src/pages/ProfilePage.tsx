import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, Stack, Group, Avatar, Button, Card, Box } from '@mantine/core';
import { IconUser, IconMail, IconLogout, IconShoppingBag } from '@tabler/icons-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { AUTH_ROUTES } from '@/constants/auth';
import { ICON_SIZES, AVATAR_SIZES } from '@/constants/ui';
import styles from '@/styles/ProfilePage.module.scss';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="xl" radius="md" className={styles.header}>
          <Group>
            <Avatar src={user.image} size={AVATAR_SIZES.LG} radius="xl" />
            <Box>
              <Title order={2}>
                {user.firstName} {user.lastName}
              </Title>
              <Text c="dimmed" size="sm">
                @{user.username}
              </Text>
            </Box>
          </Group>
        </Paper>

        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Title order={3}>Profile Information</Title>

            <Group gap="sm" align="flex-start">
              <IconUser size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Full Name
                </Text>
                <Text fw={500} ta="left">
                  {user.firstName} {user.lastName}
                </Text>
              </Box>
            </Group>

            <Group gap="sm" align="flex-start">
              <IconMail size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Email Address
                </Text>
                <Text fw={500} ta="left">{user.email}</Text>
              </Box>
            </Group>

            <Group gap="sm" align="flex-start">
              <IconUser size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Username
                </Text>
                <Text fw={500} ta="left">{user.username}</Text>
              </Box>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Title order={3}>Quick Actions</Title>

            <Button
              variant="light"
              leftSection={<IconShoppingBag size={ICON_SIZES.MD} />}
              onClick={() => navigate(AUTH_ROUTES.ORDERS)}
              fullWidth
            >
              View My Orders
            </Button>

            <Button
              variant="outline"
              color="red"
              leftSection={<IconLogout size={ICON_SIZES.MD} />}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
