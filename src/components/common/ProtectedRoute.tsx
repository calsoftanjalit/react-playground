import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Stack, Title, Text, Button, Loader } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import type { ProtectedRouteProps } from '@/types/components';
import { useAuthStore } from '@/hooks/useAuthStore';
import { AUTH_ROUTES } from '@/constants/auth';
import styles from '@/styles/ProtectedRoute.module.scss';

export const ProtectedRoute = ({ children, redirectTo = AUTH_ROUTES.LOGIN }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <Container py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Verifying authentication...</Text>
        </Stack>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export const UnauthorizedAccess = () => {
  const location = useLocation();

  return (
    <Container py="xl">
      <Stack align="center" gap="md" className={styles.unauthorizedContainer}>
        <IconLock className={styles.lockIcon} />
        <Title order={2}>Access Denied</Title>
        <Text c="dimmed" size="lg">
          You need to be logged in to access this page.
        </Text>
        <Button
          component="a"
          href={`${AUTH_ROUTES.LOGIN}?redirect=${location.pathname}`}
          size="md"
        >
          Go to Login
        </Button>
      </Stack>
    </Container>
  );
};
