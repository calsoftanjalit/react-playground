import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import Product from '@/components/home/Product';
import { ProductInterface } from '@/types/product';

// Mock hook
vi.mock('@/hooks/useAddCartProduct', () => ({
  useAddCartProduct: vi.fn(),
}));

// Import AFTER mock
import { useAddCartProduct } from '@/hooks/useAddCartProduct';

// Mock QuantitySelector (render simple buttons instead)
vi.mock('@/components/home/QuantitySelector', () => ({
  default: ({ quantity, handleIncrement, handleDecrement }: any) => (
    <div>
      <span>Qty: {quantity}</span>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  ),
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('Product Component', () => {
  const mockProduct: ProductInterface = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    thumbnail: '/a.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: vi.fn(),
      updateItem: vi.fn(),
      quantity: 0,
      cartItem: null,
    });

    renderWithMantine(<Product {...mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test Product' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls handleAddCartProduct when "Add to Cart" is clicked', () => {
    const mockAdd = vi.fn();

    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: mockAdd,
      updateItem: vi.fn(),
      quantity: 0,
      cartItem: null,
    });

    renderWithMantine(<Product {...mockProduct} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAdd).toHaveBeenCalledWith(mockProduct.id);
  });

  it('shows QuantitySelector when product is already in cart', () => {
    const mockUpdate = vi.fn();

    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: vi.fn(),
      updateItem: mockUpdate,
      quantity: 2,
      cartItem: { id: 1, quantity: 2 },
    });

    renderWithMantine(<Product {...mockProduct} />);

    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('calls updateItem when QuantitySelector increment/decrement are clicked', () => {
    const mockUpdate = vi.fn();

    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: vi.fn(),
      updateItem: mockUpdate,
      quantity: 3,
      cartItem: { id: 1, quantity: 3 },
    });

    renderWithMantine(<Product {...mockProduct} />);

    fireEvent.click(screen.getByText('+'));
    expect(mockUpdate).toHaveBeenCalledWith(1, 4);

    fireEvent.click(screen.getByText('-'));
    expect(mockUpdate).toHaveBeenCalledWith(1, 2);
  });
});
