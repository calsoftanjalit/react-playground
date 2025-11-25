import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsPage from '@/pages/ProductPage';
import { ErrorMessageInterface, ProductApiInterface } from '@/types';
import { useProduct } from '@/hooks';

vi.mock('@/hooks/useProduct');
vi.mock('@/components/product', () => ({
  FilterBar: () => <div>Mock FilterBar</div>,
  ProductList: ({ products }: ProductApiInterface) => <div>Mock ProductList {products.length}</div>,
}));

vi.mock('@/components/miscellaneous', () => ({
  ErrorMessage: ({ message }: ErrorMessageInterface) => <div>Error: {message}</div>,
  LoadingIndicator: () => <div>Loading...</div>,
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<ProductsPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithMantine(<ProductsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product list when data is loaded', () => {
    (useProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { products: [{ id: 1 }] },
      isLoading: false,
      error: null,
    });

    renderWithMantine(<ProductsPage />);

    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock FilterBar/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock ProductList 1/i)).toBeInTheDocument();
  });

  it('renders empty ProductList if no products available', () => {
    (useProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { products: [] },
      isLoading: false,
      error: null,
    });

    renderWithMantine(<ProductsPage />);

    expect(screen.getByText(/Mock ProductList 0/i)).toBeInTheDocument();
  });

  it('renders error message when API fails', () => {
    (useProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Server error' },
    });

    renderWithMantine(<ProductsPage />);

    expect(screen.getByText(/Error: Server error/i)).toBeInTheDocument();
  });
});
