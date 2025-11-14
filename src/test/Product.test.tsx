import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { ProductInterface } from '@/types/product';
import Product from '@/components/home/Product';
import { useAddCartProduct } from '@/hooks/useAddCartProduct';

vi.mock('@/hooks/useAddCartProduct', () => ({
  useAddCartProduct: vi.fn(),
}));

describe('Product component', () => {
  const mockHandleAddCartProduct = vi.fn();

  const mockProduct: ProductInterface = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    thumbnail: '/a.jpg',
  };

  const renderWithMantine = (ui: React.ReactNode) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  beforeEach(() => {
    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: mockHandleAddCartProduct,
      mutation: { isPending: false },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithMantine(<Product {...mockProduct} />);
    const button = screen.getByRole('button', { name: /add to cart/i });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test Product' }));
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('renders the correct title', () => {
    renderWithMantine(<Product {...mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders the correct price', () => {
    renderWithMantine(<Product {...mockProduct} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders correctly with different product data', () => {
    const newProduct: ProductInterface = {
      id: 2,
      title: 'Another Product',
      price: 49.5,
      thumbnail: '/a.jpg',
    };

    renderWithMantine(<Product {...newProduct} />);
    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('$49.5')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Another Product' })).toBeInTheDocument();
  });

  it('disables the "Add to Cart" button while mutation is pending', () => {
    const newProduct: ProductInterface = {
      id: 2,
      title: 'Another Product',
      price: 49.5,
      thumbnail: '/a.jpg',
    };

    (useAddCartProduct as ReturnType<typeof vi.fn>).mockReturnValue({
      handleAddCartProduct: mockHandleAddCartProduct,
      mutation: { isPending: true },
    });

    renderWithMantine(<Product {...newProduct} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeDisabled();
  });
});
