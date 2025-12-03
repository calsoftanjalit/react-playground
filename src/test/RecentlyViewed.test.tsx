import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';
import { RecentlyViewed } from '@/components/recently-viewed';

const mockGetItems = vi.fn();
vi.mock('@/hooks/useRecentlyViewed', () => ({
  useRecentlyViewed: () => ({
    getItems: mockGetItems,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }),
  };
});

describe('RecentlyViewed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no items exist', () => {
    mockGetItems.mockReturnValue([]);

    render(
      <MantineProvider>
        <RecentlyViewed />
      </MantineProvider>
    );

    expect(screen.queryByText('Recently Viewed Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it('should render recently viewed products', () => {
    mockGetItems.mockReturnValue([
      { id: 1, title: 'Product 1', price: 10, thumbnail: 'img1.jpg' },
      { id: 2, title: 'Product 2', price: 20, thumbnail: 'img2.jpg' },
    ]);

    render(
      <MantineProvider>
        <RecentlyViewed />
      </MantineProvider>
    );

    expect(screen.getByText('Recently Viewed Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();

    // Optional: simulate click
    fireEvent.click(screen.getByText('Product 1'));
    expect(mockNavigate).toHaveBeenCalledWith('/products/1');
  });
});
