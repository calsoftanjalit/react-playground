import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersPage } from '@/pages/OrdersPage';
import { MantineProvider } from '@mantine/core';
import * as orderService from '@/services/orderService';

const mockUseAuthStore = vi.fn();
vi.mock('@/hooks/useAuthStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/services/orderService', () => ({
  getUserOrders: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/styles/OrdersPage.module.scss', () => ({
  default: {
    orderCard: 'orderCard',
    orderItem: 'orderItem',
    productImage: 'productImage',
    productDetails: 'productDetails',
    priceSection: 'priceSection',
  },
}));

describe('OrdersPage', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  const mockOrders = [
    {
      id: 'ORD-1',
      userId: 1,
      date: '2024-01-01T00:00:00.000Z',
      total: 100,
      status: 'delivered' as const,
      items: [
        {
          id: 1,
          title: 'Product 1',
          price: 50,
          quantity: 2,
          thumbnail: 'img1.jpg',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({ user: mockUser });
    vi.mocked(orderService.getUserOrders).mockReturnValue(mockOrders);
  });

  const renderOrdersPage = () => {
    return render(
      <MantineProvider>
        <MemoryRouter>
          <OrdersPage />
        </MemoryRouter>
      </MantineProvider>
    );
  };

  it('should render orders list', () => {
    renderOrdersPage();

    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-1')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    
    const priceElements = screen.getAllByText('$100.00');
    expect(priceElements.length).toBeGreaterThan(0);
    expect(priceElements[0]).toBeInTheDocument();
  });

  it('should render empty state when no orders exist', () => {
    vi.mocked(orderService.getUserOrders).mockReturnValue([]);
    renderOrdersPage();

    expect(screen.getByText('No Orders Yet')).toBeInTheDocument();
    expect(screen.getByText('Start Shopping')).toBeInTheDocument();
  });

  it('should not render order content if user is not logged in', () => {
    mockUseAuthStore.mockReturnValue({ user: null });
    renderOrdersPage();
    
    expect(screen.queryByText('My Orders')).not.toBeInTheDocument();
    expect(screen.queryByText('Order #ORD-1')).not.toBeInTheDocument();
  });

  it('should navigate to product details when clicking an item', () => {
    renderOrdersPage();

    const productItem = screen.getByText('Product 1').closest('.orderItem');
    fireEvent.click(productItem!);

    expect(mockNavigate).toHaveBeenCalledWith('/products/1');
  });

  it('should show expansion button for orders with many items', () => {
    const manyItems = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: 10,
      quantity: 1,
      thumbnail: `img${i + 1}.jpg`,
    }));

    const orderWithManyItems = {
      ...mockOrders[0],
      items: manyItems,
    };

    vi.mocked(orderService.getUserOrders).mockReturnValue([orderWithManyItems]);
    renderOrdersPage();

    expect(screen.getByText('View 2 More Products')).toBeInTheDocument();
  });

  it('should expand/collapse order items', () => {
    const manyItems = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: 10,
      quantity: 1,
      thumbnail: `img${i + 1}.jpg`,
    }));

    const orderWithManyItems = {
      ...mockOrders[0],
      items: manyItems,
    };

    vi.mocked(orderService.getUserOrders).mockReturnValue([orderWithManyItems]);
    renderOrdersPage();

    const expandButton = screen.getByText('View 2 More Products');
    fireEvent.click(expandButton);

    expect(screen.getByText('Show Less')).toBeInTheDocument();
    expect(screen.getByText('Product 5')).toBeInTheDocument();
    expect(screen.getByText('Product 6')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Less'));
    expect(screen.getByText('View 2 More Products')).toBeInTheDocument();
  });
});
