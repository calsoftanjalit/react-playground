import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header/Header';
import { AUTH_ROUTES } from '@/constants/auth';
import type { AuthUser } from '@/types/auth';

const mockLogout = vi.fn();
let mockUser: AuthUser | null = null;
let mockIsAuthenticated = false;

vi.mock('@/hooks/useAuthStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    logout: mockLogout,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderHeader = (opened = false, toggle = vi.fn(), initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MantineProvider>
        <Header opened={opened} toggle={toggle} />
      </MantineProvider>
    </MemoryRouter>
  );

describe('<Header />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockIsAuthenticated = false;
  });

  it('renders the header title', () => {
    renderHeader();
    expect(screen.getByText('MyShop')).toBeInTheDocument();
  });

  it('renders the burger menu button', () => {
    renderHeader();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls toggle when burger menu is clicked', () => {
    const mockToggle = vi.fn();
    renderHeader(false, mockToggle);

    const buttons = screen.getAllByRole('button');
    const burgerButton = buttons[0];
    fireEvent.click(burgerButton);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders the rocket icon (as svg)', () => {
    renderHeader();

    const title = screen.getByText('MyShop');
    const icon = title.previousSibling as SVGElement;

    expect(icon?.tagName.toLowerCase()).toBe('svg');
  });

  it('renders all navigation links', () => {
    renderHeader();

    ['Home', 'Products', 'Wishlist', 'Cart', 'Checkout'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('applies active class to current route', () => {
    renderHeader(false, vi.fn(), '/products');

    const productsLink = screen.getByText('Products');
    expect(productsLink.className).toContain('activeLink');
  });

  it('applies inactive class to non-active routes', () => {
    renderHeader(false, vi.fn(), '/products');

    const homeLink = screen.getByText('Home');
    expect(homeLink.className).toContain('inactiveLink');
  });

  it('renders login button when user is not authenticated', () => {
    mockIsAuthenticated = false;
    renderHeader();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders logout menu item when user is authenticated', async () => {
    mockIsAuthenticated = true;
    mockUser = { id: 1, username: 'test', firstName: 'TestUser' } as unknown as AuthUser;
    renderHeader();
    
    const menuTrigger = screen.getByText('TestUser');
    fireEvent.click(menuTrigger);
    
    await waitFor(() => {
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });
  });

  it('calls logout when logout menu item is clicked', async () => {
    mockIsAuthenticated = true;
    mockUser = { id: 1, username: 'test', firstName: 'TestUser' } as unknown as AuthUser;
    renderHeader();
    
    const menuTrigger = screen.getByText('TestUser');
    fireEvent.click(menuTrigger);
    
    const logoutItem = await waitFor(() => screen.getByText(/logout/i));
    fireEvent.click(logoutItem);
    
    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('navigates to login page when login button is clicked', () => {
    mockIsAuthenticated = false;
    renderHeader();
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.LOGIN);
  });
});
