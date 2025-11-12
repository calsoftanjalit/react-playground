import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { ProductInterface } from '@/types/product';
import Product from '@/components/home/Product';

describe('Product component', () => {
  const mockProduct: ProductInterface = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    thumbnail: '/a.jpg',
  };

  const renderWithMantine = (ui: React.ReactNode) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it('renders without crashing', () => {
    renderWithMantine(<Product {...mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test Product' }));
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
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
});
