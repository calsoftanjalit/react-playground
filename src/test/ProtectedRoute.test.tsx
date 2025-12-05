import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProtectedRoute, UnauthorizedAccess } from '@/components/common/ProtectedRoute';
import { MantineProvider } from '@mantine/core';

const mockUseAuthStore = vi.fn();
vi.mock('@/hooks/useAuthStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/styles/ProtectedRoute.module.scss', () => ({
  default: {
    unauthorizedContainer: 'unauthorizedContainer',
    lockIcon: 'lockIcon',
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;

  const renderProtectedRoute = (initialEntry = '/protected') => {
    return render(
      <MantineProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      </MantineProvider>
    );
  };

  it('should render children when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      checkAuth: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      checkAuth: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading state while checking auth', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      checkAuth: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
  });

  it('should call checkAuth on mount', () => {
    const checkAuthMock = vi.fn();
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      checkAuth: checkAuthMock,
    });

    renderProtectedRoute();

    expect(checkAuthMock).toHaveBeenCalledTimes(1);
  });
});

describe('UnauthorizedAccess', () => {
  it('should render access denied message', () => {
    render(
      <MantineProvider>
        <MemoryRouter>
          <UnauthorizedAccess />
        </MemoryRouter>
      </MantineProvider>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/you need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
  });
});
