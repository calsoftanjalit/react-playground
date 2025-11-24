import { renderHook, act } from '@testing-library/react';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';
import { useCartStore } from '@/hooks/useCartStore';
import { useMutation } from '@tanstack/react-query';
import { CART_USER } from '@/constants/api';
import { showToast } from '@/utils/showToast';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('@/services/cartService', () => ({
  addCart: vi.fn(),
}));

vi.mock('@/hooks/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/utils/showToast', () => ({
  showToast: vi.fn(),
}));

describe('useAddCartProduct hook', () => {
  const mutateMock = vi.fn();
  const addItem = vi.fn();
  const updateItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      addItem,
      updateItem,
    });
  });

  it('returns default values correctly', () => {
    const { result } = renderHook(() => useAddCartProduct(1));

    expect(result.current.quantity).toBe(0);
    expect(result.current.cartItem).toBeUndefined();
    expect(result.current.updateItem).toBe(updateItem);
    expect(typeof result.current.handleAddCartProduct).toBe('function');
  });

  it('calls mutation.mutate with correct payload', () => {
    const { result } = renderHook(() => useAddCartProduct(1));

    act(() => {
      result.current.handleAddCartProduct(1);
    });

    expect(mutateMock).toHaveBeenCalledWith({
      userId: CART_USER,
      products: [{ id: 1, quantity: 1 }],
    });
  });

  it('onSuccess: calls showToast + addItem', () => {
    const productData = {
      products: [{ id: 99, quantity: 1, title: 'Test Product' }],
    };

    (useMutation as ReturnType<typeof vi.fn>).mockImplementation((opts) => {
      opts.onSuccess(productData);
      return { mutate: mutateMock };
    });

    renderHook(() => useAddCartProduct(99));

    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Added to cart',
      message: 'Test Product has been added to your cart',
      autoClose: 3000,
    });

    expect(addItem).toHaveBeenCalledWith(productData.products[0]);
  });

  it('onError: calls showToast with error', () => {
    const error = new Error('Failed');

    (useMutation as ReturnType<typeof vi.fn>).mockImplementation((opts) => {
      opts.onError(error);
      return { mutate: mutateMock };
    });

    renderHook(() => useAddCartProduct(1));

    expect(showToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'The item could not be added to your cart.',
      autoClose: 3000,
    });
  });

  it('derives quantity from existing cartItem', () => {
    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [{ id: 5, quantity: 3 }],
      addItem,
      updateItem,
    });

    const { result } = renderHook(() => useAddCartProduct(5));

    expect(result.current.quantity).toBe(3);
    expect(result.current.cartItem).toEqual({ id: 5, quantity: 3 });
  });
});
