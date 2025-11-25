import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ProductList } from '@/components/product';

vi.mock('@/components/home', () => ({
  Product: ({ title }: { title: string }) => <div>{title}</div>,
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

const mockProducts = [
  { id: 1, title: 'Product A', price: 100, thumbnail: 'img1' },
  { id: 2, title: 'Product B', price: 200, thumbnail: 'img2' },
];

describe('ProductList', () => {
  it('renders product items when products exist', () => {
    renderWithMantine(<ProductList products={mockProducts} />);

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  it('shows not available message when no products passed', () => {
    renderWithMantine(<ProductList products={[]} />);

    expect(screen.getByText(/Products are not available/i)).toBeInTheDocument();
  });
});
