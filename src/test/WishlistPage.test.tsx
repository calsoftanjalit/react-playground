import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WishlistPage from '@/pages/WishlistPage';
import { useWishlistStore } from '@/hooks/useWishlistStore';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

// Mock useWishlistStore
vi.mock('@/hooks/useWishlistStore', () => ({
  useWishlistStore: vi.fn(),
}));

// Mock Product component to simplify testing
vi.mock('@/components/home/Product', () => ({
  default: ({ title }: { title: string }) => <div data-testid="product-card">{title}</div>,
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 100,
  thumbnail: 'test.jpg',
  description: 'Test Description',
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  brand: 'Test Brand',
  category: 'Test Category',
  images: ['test.jpg'],
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: 'No Returns',
  warrantyInformation: 'No Warranty',
  shippingInformation: 'Free Shipping',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    barcode: '123456789',
    qrCode: '123456789',
  },
  sku: '123456789',
  weight: 1,
  dimensions: {
    width: 1,
    height: 1,
    depth: 1,
  },
  tags: ['test'],
};

describe('WishlistPage', () => {
  const mockClearWishlist = vi.fn();

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <MantineProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </MantineProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when wishlist is empty', () => {
    (useWishlistStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [],
      clearWishlist: mockClearWishlist,
    });

    renderWithProviders(<WishlistPage />);

    expect(screen.getByText('Your Wishlist is Empty')).toBeInTheDocument();
    expect(screen.getByText('Start Shopping')).toBeInTheDocument();
  });

  it('should render wishlist items when not empty', () => {
    (useWishlistStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct],
      clearWishlist: mockClearWishlist,
    });

    renderWithProviders(<WishlistPage />);

    expect(screen.getByText('My Wishlist')).toBeInTheDocument();
    expect(screen.getByText('1 item saved for later')).toBeInTheDocument();
    expect(screen.getByTestId('product-card')).toHaveTextContent('Test Product');
  });

  it('should call clearWishlist when clear button is clicked', () => {
    (useWishlistStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct],
      clearWishlist: mockClearWishlist,
    });

    renderWithProviders(<WishlistPage />);

    const clearButton = screen.getByText('Clear Wishlist');
    fireEvent.click(clearButton);

    expect(mockClearWishlist).toHaveBeenCalled();
  });

  it('should display correct item count pluralization', () => {
    (useWishlistStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      wishlist: [mockProduct, { ...mockProduct, id: 2, title: 'Product 2' }],
      clearWishlist: mockClearWishlist,
    });

    renderWithProviders(<WishlistPage />);

    expect(screen.getByText('2 items saved for later')).toBeInTheDocument();
  });
});
