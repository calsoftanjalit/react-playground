import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { addCart } from '@/services/cartService';
import { notifications } from '@mantine/notifications';
import { CART_USER } from '@/constants/api';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';

vi.mock('@/services/cartService', () => ({
  addCart: vi.fn(),
}));

vi.mock('@/constants/api', () => ({
  CART_USER: 5,
}));

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useAddCartProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call addCart and show success notification on success', async () => {
    (addCart as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAddCartProduct(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.handleAddCartProduct(123);
    });

    expect(addCart).toHaveBeenCalledWith(
      {
        userId: CART_USER,
        products: [{ id: 123, quantity: 1 }],
      },
      expect.any(Object) // This will match the second argument (QueryClient options)
    );

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Success!',
      message: 'Item added to cart.',
      color: 'green',
    });
  });

  it('should show error notification on failure', async () => {
    (addCart as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useAddCartProduct(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.handleAddCartProduct(456);
    });

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Error!',
      message: 'The item could not be added to your cart.',
      color: 'red',
    });
  });
});
