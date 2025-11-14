import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Cart from '@/pages/Cart';

vi.mock('@/components/Cart/CartTable', () => ({
  default: () => <div>Mock CartTable</div>,
}));

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <MantineProvider>{ui}</MantineProvider>
    </BrowserRouter>
  );

describe('<Cart /> component', () => {
  it('renders static UI elements correctly', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
    expect(screen.getByText(/cart items/i)).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByText('Mock CartTable')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /checkout/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  it('renders Checkout button with Mantine Button root class', () => {
    renderWithProviders(<Cart />);

    const btn = screen.getByRole('button', { name: /checkout/i });
    expect(btn.className).toMatch(/mantine-Button-root/);
  });

  it('contains a valid link to home route', () => {
    renderWithProviders(<Cart />);

    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
