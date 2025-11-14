import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import ProductDetails from '@/components/home/ProductDetails';
import { fetchProductById } from '@/services/productService';

// Mock the dependencies
vi.mock('@/services/productService');
vi.mock('@/components/miscellaneous/ProductReviewComponent', () => ({
  default: ({ reviews }) => (
    <div data-testid="product-reviews">Reviews: {reviews?.length || 0}</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  thumbnail: 'https://example.com/image.jpg',
  availabilityStatus: 'In Stock',
  reviews: [
    { id: 1, comment: 'Great product', rating: 5 },
    { id: 2, comment: 'Good quality', rating: 4 },
  ],
};

describe('ProductDetails', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ProductDetails />
          </BrowserRouter>
        </QueryClientProvider>
      </MantineProvider>
    );
  };

  it('should render loading state initially', () => {
    vi.mocked(fetchProductById).mockImplementation(() => new Promise(() => {}));

    const { container } = renderComponent();

    // Check for Mantine Loader
    expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('should render product details after loading', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    // Wait for product title to appear (it appears in two places: breadcrumb and image section)
    await waitFor(() => {
      expect(screen.getAllByText('Test Product').length).toBeGreaterThan(0);
    });

    // Check price
    expect(screen.getByText('$99.99')).toBeInTheDocument();

    // Check availability badge
    expect(screen.getByText('In Stock')).toBeInTheDocument();

    // Check product image
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch product';
    vi.mocked(fetchProductById).mockRejectedValue(new Error(errorMessage));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should render "Product not found" when product is null', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(null);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
  });

  it('should render Buy Now and Add To Cart buttons', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });
  });

  it('should display "Out of Stock" badge for unavailable products', async () => {
    const outOfStockProduct = {
      ...mockProduct,
      availabilityStatus: 'Out of Stock',
    };
    vi.mocked(fetchProductById).mockResolvedValue(outOfStockProduct);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
  });

  it('should display green badge for in-stock products', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    const { container } = renderComponent();

    await waitFor(() => {
      const badge = container.querySelector('.mantine-Badge-root');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('In Stock');
    });
  });

  it('should render breadcrumbs with Home and product title', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    await waitFor(() => {
      // Check breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
      // Product title appears in breadcrumb
      const breadcrumbLinks = screen.getAllByRole('link');
      expect(breadcrumbLinks.length).toBeGreaterThan(0);
    });
  });

  it('should render ProductReviewComponent with reviews', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    await waitFor(() => {
      const reviewComponent = screen.getByTestId('product-reviews');
      expect(reviewComponent).toBeInTheDocument();
      expect(reviewComponent).toHaveTextContent('Reviews: 2');
    });
  });

  it('should render product description text', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    await waitFor(() => {
      // Check for Lorem ipsum text (description)
      expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
    });
  });

  it('should render product image with correct styling', async () => {
    vi.mocked(fetchProductById).mockResolvedValue(mockProduct);

    renderComponent();

    await waitFor(() => {
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveStyle({
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      });
    });
  });
});
 