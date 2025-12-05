import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Box,
  Group,
} from '@mantine/core';
import { IconLogin, IconInfoCircle } from '@tabler/icons-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import type { LoginCredentials } from '@/types/auth';
import { MOCK_USERS } from '@/constants/auth';
import { ICON_SIZES } from '@/constants/ui';
import styles from '@/styles/LoginPage.module.scss';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      return;
    }

    await login(credentials).catch(() => {
    });
  };

  const handleDemoLogin = (username: string, password: string) => {
    setCredentials({ username, password });
    setTimeout(() => {
      login({ username, password }).catch(() => {
      });
    }, 100);
  };

  return (
    <Container size="sm" py="xl" className={styles.container}>
      <Paper shadow="md" p="xl" radius="md" className={styles.paper}>
        <Stack gap="lg">
          <Box className={styles.header}>
            <IconLogin size={ICON_SIZES.XL} className={styles.icon} />
            <Title order={2} className={styles.title}>
              Welcome Back
            </Title>
            <Text c="dimmed" size="sm">
              Sign in to your account
            </Text>
          </Box>

          {error && (
            <Alert color="red" title="Login Failed" icon={<IconInfoCircle />}>
              {error}
            </Alert>
          )}

          <Alert color="blue" title="Demo Accounts" icon={<IconInfoCircle />}>
            <Text size="sm" mb="xs">
              Use these credentials to test the login:
            </Text>
            <Stack gap="xs">
              {MOCK_USERS.map(user => (
                <Group key={user.id} justify="space-between" className={styles.demoUser}>
                  <Box>
                    <Text size="sm" fw={500}>
                      {user.username}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Password: {user.password}
                    </Text>
                  </Box>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleDemoLogin(user.username, user.password)}
                    disabled={isLoading}
                  >
                    Use
                  </Button>
                </Group>
              ))}
            </Stack>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                required
                disabled={isLoading}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                loading={isLoading}
                leftSection={<IconLogin size={ICON_SIZES.MD} />}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};
