import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import Cart from '@/components/Cart/Cart';

// Mocking the child CartTable component
vi.mock('@/components/Cart/CartTable', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-table">CartTable Component</div>,
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<Cart /> component', () => {
  it('renders without crashing and displays static elements', () => {
    renderWithMantine(<Cart />);

    expect(screen.getByText(/cart items/i)).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByTestId('cart-table')).toBeInTheDocument();

    const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
    expect(checkoutBtn).toBeInTheDocument();
    expect(checkoutBtn).toBeEnabled();
  });

  it('renders the Checkout button with correct Mantine props', () => {
    renderWithMantine(<Cart />);

    const button = screen.getByRole('button', { name: /checkout/i });
    expect(button).toHaveClass('mantine-Button-root');
  });
});
