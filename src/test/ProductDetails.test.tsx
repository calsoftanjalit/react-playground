import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Box, MantineProvider } from '@mantine/core';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/context';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { getLocalReviews, calculateDiscountedPrice } from '@/utils';
import ProductDetails from '@/components/home/ProductDetails';

vi.mock('@/components/product', () => ({
  ProductGallery: vi.fn(() => <div>ProductGallery</div>),
}));


vi.mock('@mantine/core', async (): Promise<Record<string, unknown>> => {
  const actual = await vi.importActual<typeof import('@mantine/core')>('@mantine/core');
  return {
    ...actual,
    Loader: () => (
      <Box data-testid="loader">
        Loader
      </Box>
    ),
    Center: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});


vi.mock('@/components/home/QuantitySelector', () => ({
  default: ({
    quantity,
    handleIncrement,
    handleDecrement,
  }: {
    quantity: number;
    handleIncrement: () => void;
    handleDecrement: () => void;
  }) => (
    <div>
      <button onClick={handleIncrement}>+</button>
      <span>{quantity}</span>
      <button onClick={handleDecrement}>-</button>
    </div>
  ),
}));

vi.mock('@/components/common/WishlistButton', () => ({
  WishlistButton: () => <div>WishlistButton</div>,
}));

vi.mock('@/components/miscellaneous/ProductInfoPanel', () => ({
  default: () => <div>ProductInfoPanel</div>,
}));

vi.mock('@/components/miscellaneous/ProductReviewDetails', () => ({
  default: () => <div>ProductReviewComponent</div>,
}));

vi.mock('@tanstack/react-query');
vi.mock('react-router-dom');
vi.mock('@/context');
vi.mock('@/hooks/useCheckoutFormContext');
vi.mock('@/utils');

describe('<ProductDetails />', () => {
  const mockAddItem = vi.fn();
  const mockUpdateItem = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockClearFormData = vi.fn();
  const mockNavigate = vi.fn();

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <MantineProvider>
        {ui}
      </MantineProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '1' });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      addItem: mockAddItem,
      updateItem: mockUpdateItem,
      removeItem: mockRemoveItem,
    });

    (useCheckoutFormContext as ReturnType<typeof vi.fn>).mockReturnValue({
      clearFormData: mockClearFormData,
    });

    (calculateDiscountedPrice as ReturnType<typeof vi.fn>).mockImplementation(
      (price: number, discount: number) => price - (price * discount) / 100
    );
    (getLocalReviews as ReturnType<typeof vi.fn>).mockReturnValue([]);
  });

  it('renders loader when isLoading', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<ProductDetails />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error message when isError', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Not found'),
    });

    renderWithProviders(<ProductDetails />);
    expect(screen.getByText(/Not found/i)).toBeInTheDocument();
  });

  it('renders product with discount and in-stock badge', () => {
    const product = {
      id: '1',
      title: 'Test Product',
      description: 'Desc',
      price: 100,
      discountPercentage: 20,
      thumbnail: 'thumb.jpg',
      images: ['img1.jpg'],
      availabilityStatus: 'In Stock',
      reviews: [],
    };

    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: product,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<ProductDetails />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('$80')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('ProductGallery')).toBeInTheDocument();
  });

  it('handles Add To Cart button click', () => {
    const product = {
      id: '2',
      title: 'Cart Product',
      description: 'Desc',
      price: 100,
      discountPercentage: 10,
      thumbnail: 'thumb.jpg',
      images: [],
      availabilityStatus: 'In Stock',
      reviews: [],
    };

    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: product,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<ProductDetails />);
    fireEvent.click(screen.getByText(/Add To Cart/i));
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2', discountedPrice: 90 })
    );
  });

  it('handles Buy Now button click', () => {
    const product = {
      id: '3',
      title: 'BuyNow Product',
      description: 'Desc',
      price: 200,
      discountPercentage: 20,
      thumbnail: 'thumb.jpg',
      images: [],
      availabilityStatus: 'In Stock',
      reviews: [],
    };

    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: product,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<ProductDetails />);

    fireEvent.click(screen.getByText(/Buy Now/i));

    expect(mockClearFormData).toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith('/products/3/checkout', {
      state: {
        buyNowItem: {
          id: '3',
          title: 'BuyNow Product',
          price: 200,
          quantity: 1,
          thumbnail: 'thumb.jpg',
          discountedPrice: 160,
        },
      },
    });
  });
});
