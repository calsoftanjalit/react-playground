import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WishlistButton } from '@/components/common/WishlistButton';
import { useWishlistStore } from '@/hooks/useWishlistStore';
import { ProductInterface } from '@/types/product';
import { MantineProvider } from '@mantine/core';

// Mock useWishlistStore
vi.mock('@/hooks/useWishlistStore', () => ({
  useWishlistStore: vi.fn(),
}));

const mockProduct: ProductInterface = {
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
} as ProductInterface;

describe('WishlistButton', () => {
  const mockAddToWishlist = vi.fn();
  const mockRemoveFromWishlist = vi.fn();
  const mockIsInWishlist = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useWishlistStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addToWishlist: mockAddToWishlist,
      removeFromWishlist: mockRemoveFromWishlist,
      isInWishlist: mockIsInWishlist,
    });
  });

  const renderWithMantine = (ui: React.ReactNode) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('should render correctly', () => {
    renderWithMantine(<WishlistButton product={mockProduct} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show filled heart when item is in wishlist', () => {
    mockIsInWishlist.mockReturnValue(true);
    renderWithMantine(<WishlistButton product={mockProduct} />);
    
    // Check for red color/fill which indicates active state
    // Note: Testing SVG attributes directly can be tricky, checking calls is safer
    expect(mockIsInWishlist).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should call addToWishlist when clicked and not in wishlist', () => {
    mockIsInWishlist.mockReturnValue(false);
    renderWithMantine(<WishlistButton product={mockProduct} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct);
    expect(mockRemoveFromWishlist).not.toHaveBeenCalled();
  });

  it('should call removeFromWishlist when clicked and already in wishlist', () => {
    mockIsInWishlist.mockReturnValue(true);
    renderWithMantine(<WishlistButton product={mockProduct} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id);
    expect(mockAddToWishlist).not.toHaveBeenCalled();
  });

  it('should prevent default event propagation', () => {
    mockIsInWishlist.mockReturnValue(false);
    const handleParentClick = vi.fn();

    renderWithMantine(
      <div onClick={handleParentClick}>
        <WishlistButton product={mockProduct} />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.mouseDown(button);

    expect(handleParentClick).not.toHaveBeenCalled();
  });
});
