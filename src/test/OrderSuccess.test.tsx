import { OrderSuccess } from '@/components/checkout/OrderSuccess';
import { OrderSummary } from '@/types/checkout';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockOrderSummary: OrderSummary = {
  orderId: 'ORD-12345',
  fullName: 'John Doe',
  email: 'john@example.com',
  address: '123 Main St, City, State 12345',
  totalAmount: 150.99,
  orderDate: '2024-03-15',
  items: [
    {
      id: 1,
      name: 'Product 1',
      quantity: 2,
      price: 200,
      image: '/product1.jpg',
    },
    {
      id: 2,
      name: 'Product 2',
      quantity: 1,
      price: 150,
      image: '/product2.jpg',
    },
  ],
};

describe('OrderSuccess', () => {
  const renderComponent = (orderSummary: OrderSummary = mockOrderSummary) => {
    return render(
      <MantineProvider>
        <BrowserRouter>
          <OrderSuccess orderSummary={orderSummary} />
        </BrowserRouter>
      </MantineProvider>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render success message', () => {
    renderComponent();
    expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thank you for your purchase. Your order has been confirmed and will be shipped soon.'
      )
    ).toBeInTheDocument();
  });

  it('should display order ID', () => {
    renderComponent();
    expect(screen.getByText(/ORD-12345/i)).toBeInTheDocument();
  });

  it('should display customer information', () => {
    renderComponent();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should display shipping address', () => {
    renderComponent();
    expect(screen.getByText('123 Main St, City, State 12345')).toBeInTheDocument();
  });

  it('should display order date', () => {
    renderComponent();
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
  });

  it('should display all order items', () => {
    renderComponent();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should display item quantities and prices', () => {
    renderComponent();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should calculate and display subtotal correctly', () => {
    renderComponent();
    expect(screen.getByText(/\$550\.00/)).toBeInTheDocument();
  });

  it('should calculate and display tax at 9%', () => {
    renderComponent();
    expect(screen.getByText('Tax (9%):')).toBeInTheDocument();
    expect(screen.getByText(/\$49\.50/)).toBeInTheDocument();
  });

  it('should display shipping cost when subtotal is under $100', () => {
    const smallOrder: OrderSummary = {
      ...mockOrderSummary,
      items: [
        {
          id: 1,
          name: 'Small Item',
          quantity: 1,
          price: 50,
          image: '/item.jpg',
        },
      ],
    };
    renderComponent(smallOrder);
    expect(screen.getByText('Shipping:')).toBeInTheDocument();
    expect(screen.getByText(/\$10\.00/)).toBeInTheDocument();
  });

  it('should display FREE shipping when subtotal is over $100', () => {
    renderComponent();
    expect(screen.getByText('Shipping:')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('should calculate and display total correctly', () => {
    renderComponent();
    expect(screen.getByText(/\$599\.50/)).toBeInTheDocument();
  });

  it('should navigate to home when Continue Shopping is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const continueButton = screen.getByRole('button', { name: /continue shopping/i });
    await user.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should call window.print when Print Receipt is clicked', async () => {
    const user = userEvent.setup();
    window.print = window.print || vi.fn();
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderComponent();

    const printButton = screen.getByRole('button', { name: /print receipt/i });
    await user.click(printButton);

    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  it('should display trust badges', () => {
    renderComponent();
    expect(screen.getByText('Secure payment')).toBeInTheDocument();
    expect(screen.getByText('Money-back guarantee')).toBeInTheDocument();
    expect(screen.getByText('24/7 customer support')).toBeInTheDocument();
  });

  it('should display what\'s next information', () => {
    renderComponent();
    expect(screen.getByText("What's Next?")).toBeInTheDocument();
    expect(screen.getByText('✓ Confirmation email sent')).toBeInTheDocument();
    expect(screen.getByText('✓ Track order in "My Orders"')).toBeInTheDocument();
    expect(screen.getByText('✓ Delivery in 3-5 business days')).toBeInTheDocument();
  });

  it('should display order items count', () => {
    renderComponent();
    expect(screen.getByText(/Order Items \(2\)/i)).toBeInTheDocument();
  });

  it('should handle single item order', () => {
    const singleItemOrder: OrderSummary = {
      ...mockOrderSummary,
      items: [
        {
          id: 1,
          name: 'Single Product',
          quantity: 1,
          price: 99.99,
          image: '/product.jpg',
        },
      ],
    };
    renderComponent(singleItemOrder);
    expect(screen.getByText(/Order Items \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText('Single Product')).toBeInTheDocument();
  });

  it('should handle large quantities correctly', () => {
    const largeQuantityOrder: OrderSummary = {
      ...mockOrderSummary,
      items: [
        {
          id: 1,
          name: 'Bulk Item',
          quantity: 100,
          price: 1.5,
          image: '/item.jpg',
        },
      ],
    };
    renderComponent(largeQuantityOrder);
    expect(screen.getByText('Bulk Item')).toBeInTheDocument();
    expect(screen.getAllByText(/\$150\.00/)[0]).toBeInTheDocument();
  });

  it('should render with light color scheme class', () => {
    const { container } = renderComponent();
    expect(container.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it('should display all item images', () => {
    renderComponent();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render with dark color scheme class', () => {
    const { container } = render(
      <MantineProvider forceColorScheme="dark">
        <BrowserRouter>
          <OrderSuccess orderSummary={mockOrderSummary} />
        </BrowserRouter>
      </MantineProvider>
    );
    expect(container.querySelector('[class*="itemCardDark"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="whatsNextBoxDark"]')).toBeInTheDocument();
  });

  it('should render Avatar when item has no image', () => {
    const orderWithoutImage: OrderSummary = {
      ...mockOrderSummary,
      items: [
        {
          id: 1,
          name: 'Product without image',
          quantity: 1,
          price: 50,
          image: '',
        },
      ],
    };
    const { container } = renderComponent(orderWithoutImage);
    expect(container.querySelector('.mantine-Avatar-root')).toBeInTheDocument();
  });

  it('should use discounted price when available', () => {
    const orderWithDiscount: OrderSummary = {
      ...mockOrderSummary,
      items: [
        {
          id: 1,
          name: 'Discounted Product',
          quantity: 2,
          price: 100,
          discountedPrice: 80,
          image: '/product.jpg',
        },
      ],
    };
    renderComponent(orderWithDiscount);
    expect(screen.getByText('Discounted Product')).toBeInTheDocument();
    expect(screen.getByText(/\$80\.00 each/)).toBeInTheDocument();
  });
});
