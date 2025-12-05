import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '@/pages/LoginPage';
import { MantineProvider } from '@mantine/core';
import userEvent from '@testing-library/user-event';

const mockLogin = vi.fn();
const mockClearError = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@/hooks/useAuthStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/styles/LoginPage.module.scss', () => ({
  default: {
    container: 'container',
    paper: 'paper',
    header: 'header',
    icon: 'icon',
    title: 'title',
    demoUser: 'demoUser',
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
      isAuthenticated: false,
    });
  });

  const renderLoginPage = () => {
    return render(
      <MantineProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MantineProvider>
    );
  };

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update input values', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should call login on form submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    renderLoginPage();

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });

  it('should display error message when login fails', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
      clearError: mockClearError,
      isAuthenticated: false,
    });

    renderLoginPage();

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
      isAuthenticated: false,
    });

    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should clear error on unmount', () => {
    const { unmount } = renderLoginPage();
    unmount();
    expect(mockClearError).toHaveBeenCalled();
  });

  it('should populate demo credentials when demo button is clicked', async () => {
    vi.useFakeTimers();
    renderLoginPage();

    const useButtons = screen.getAllByRole('button', { name: /use/i });
    
    fireEvent.click(useButtons[0]);

    vi.runAllTimers();

    expect(mockLogin).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});
