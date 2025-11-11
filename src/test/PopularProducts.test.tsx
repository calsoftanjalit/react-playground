import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as productService from '@/services/productService';
import { PopularProducts } from '@/components/home';

vi.mock('@/components/miscellaneous', () => ({
  LoadingIndicator: () => <div data-testid="loader">Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

vi.mock('@/components/home/Product', () => ({
  default: ({ title, price }: { title: string; price: number }) => (
    <div data-testid="product">
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  ),
}));

vi.mock('@/services/productService', () => ({
  fetchProducts: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MantineProvider>
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PopularProducts Component', () => {
  it('renders loader while fetching products', () => {
    vi.spyOn(productService, 'fetchProducts').mockReturnValue(new Promise(() => {}));

    renderWithProviders(<PopularProducts />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error message when fetching fails', async () => {
    vi.spyOn(productService, 'fetchProducts').mockRejectedValue(
      new Error('Failed to load products')
    );

    renderWithProviders(<PopularProducts />);

    const errorEl = await screen.findByTestId('error');
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent('Failed to load products');
  });

  it('renders products when fetching succeeds', async () => {
    const mockData = {
      products: [
        { id: 1, title: 'Product A', price: 100 },
        { id: 2, title: 'Product B', price: 200 },
      ],
    };

    vi.spyOn(productService, 'fetchProducts').mockResolvedValue(mockData);

    renderWithProviders(<PopularProducts />);

    const products = await screen.findAllByTestId('product');
    expect(products).toHaveLength(2);

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();

    expect(screen.getByText(/popular products/i)).toBeInTheDocument();
  });
});
