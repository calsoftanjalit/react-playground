import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWishlistStore } from '@/hooks/useWishlistStore';
import { WishlistProvider } from '@/context/WishlistProvider';
import { notifications } from '@mantine/notifications';
import { ProductInterface } from '@/types/product';

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
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

describe('useWishlistStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WishlistProvider>{children}</WishlistProvider>
  );

  it('should initialize with empty wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });
    expect(result.current.wishlist).toEqual([]);
  });

  it('should add item to wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0].id).toBe(mockProduct.id);
    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Added to Wishlist',
        message: `${mockProduct.title} has been added to your wishlist`,
      })
    );
  });

  it('should not add duplicate item to wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });
    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    expect(result.current.wishlist).toHaveLength(1);
  });

  it('should remove item from wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });
    expect(result.current.wishlist).toHaveLength(1);

    act(() => {
      result.current.removeFromWishlist(mockProduct.id);
    });

    expect(result.current.wishlist).toHaveLength(0);
    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Removed from Wishlist',
        message: `${mockProduct.title} has been removed from your wishlist`,
      })
    );
  });

  it('should check if item is in wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    expect(result.current.isInWishlist(mockProduct.id)).toBe(false);

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    expect(result.current.isInWishlist(mockProduct.id)).toBe(true);
  });

  it('should clear wishlist', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });
    expect(result.current.wishlist).toHaveLength(1);

    act(() => {
      result.current.clearWishlist();
    });

    expect(result.current.wishlist).toHaveLength(0);
  });

  it('should persist wishlist to localStorage', () => {
    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    act(() => {
      result.current.addToWishlist(mockProduct);
    });

    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(mockProduct.id);
  });

  it('should initialize from localStorage', () => {
    const savedWishlist = [{ ...mockProduct, addedAt: Date.now() }];
    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));

    const { result } = renderHook(() => useWishlistStore(), { wrapper });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0].id).toBe(mockProduct.id);
  });

  it('should throw error when used outside of WishlistProvider', () => {
    // Suppress console.error for this test as React logs the error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useWishlistStore())).toThrow(
      'useWishlistStore must be used within a WishlistProvider'
    );

    consoleSpy.mockRestore();
  });
});
