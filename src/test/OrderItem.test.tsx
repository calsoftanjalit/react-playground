import { OrderItem } from '@/components/checkout/OrderItem';
import { CartItem } from '@/types/cart';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockItem: CartItem = {
  id: 1,
  title: 'Test Product',
  price: 49.99,
  quantity: 2,
  thumbnail: 'https://example.com/image.jpg',
};

const renderOrderItem = (props: Partial<React.ComponentProps<typeof OrderItem>> = {}) => {
  return render(
    <MantineProvider>
      <OrderItem item={mockItem} {...props} />
    </MantineProvider>
  );
};

describe('OrderItem', () => {
  describe('Rendering', () => {
    it('renders product information correctly', () => {
      renderOrderItem();

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.98')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('displays product image with correct src', () => {
      renderOrderItem();

      const image = screen.getByAltText('Test Product') as HTMLImageElement;
      expect(image).toHaveAttribute('src', expect.stringContaining('example.com/image.jpg'));
    });

    it('shows fallback image when thumbnail is missing', () => {
      const itemWithoutImage = { ...mockItem, thumbnail: '' };
      renderOrderItem({ item: itemWithoutImage });

      const image = screen.getByAltText('Test Product') as HTMLImageElement;
      expect(image).toBeInTheDocument();
    });

    it('calculates item total correctly', () => {
      const item = { ...mockItem, price: 25.50, quantity: 3 };
      renderOrderItem({ item });

      expect(screen.getByText('$76.50')).toBeInTheDocument();
    });

    it('formats price with two decimal places', () => {
      const item = { ...mockItem, price: 10, quantity: 1 };
      renderOrderItem({ item });

      expect(screen.getByText('$10.00')).toBeInTheDocument();
    });
  });

  describe('Quantity Display', () => {
    it('shows quantity as text when controls are disabled', () => {
      renderOrderItem({ showQuantityControls: false });

      expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /increment/i })).not.toBeInTheDocument();
    });

    it('shows quantity controls when enabled', () => {
      const onQuantityChange = vi.fn();
      renderOrderItem({ showQuantityControls: true, onQuantityChange });

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('displays single quantity correctly', () => {
      const item = { ...mockItem, quantity: 1 };
      renderOrderItem({ item });

      expect(screen.getByText(/qty: 1/i)).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('increments quantity when plus button is clicked', async () => {
      const onQuantityChange = vi.fn();
      const user = userEvent.setup();
      
      renderOrderItem({ showQuantityControls: true, onQuantityChange });

      const plusButton = screen.getAllByRole('button')[1];
      await user.click(plusButton);

      expect(onQuantityChange).toHaveBeenCalledWith(1, 3);
    });

    it('decrements quantity when minus button is clicked', async () => {
      const onQuantityChange = vi.fn();
      const user = userEvent.setup();
      
      renderOrderItem({ showQuantityControls: true, onQuantityChange });

      const minusButton = screen.getAllByRole('button')[0];
      await user.click(minusButton);

      expect(onQuantityChange).toHaveBeenCalledWith(1, 1);
    });

    it('disables decrement button when quantity is 1', () => {
      const item = { ...mockItem, quantity: 1 };
      const onQuantityChange = vi.fn();
      
      renderOrderItem({ item, showQuantityControls: true, onQuantityChange });

      const minusButton = screen.getAllByRole('button')[0];
      expect(minusButton).toBeDisabled();
    });

    it('does not decrement below 1', async () => {
      const item = { ...mockItem, quantity: 1 };
      const onQuantityChange = vi.fn();
      const user = userEvent.setup();
      
      renderOrderItem({ item, showQuantityControls: true, onQuantityChange });

      const minusButton = screen.getAllByRole('button')[0];
      await user.click(minusButton);

      expect(onQuantityChange).not.toHaveBeenCalled();
    });

    it('allows multiple increments', async () => {
      const onQuantityChange = vi.fn();
      const user = userEvent.setup();
      
      renderOrderItem({ showQuantityControls: true, onQuantityChange });

      const plusButton = screen.getAllByRole('button')[1];
      await user.click(plusButton);
      await user.click(plusButton);
      await user.click(plusButton);

      expect(onQuantityChange).toHaveBeenCalledTimes(3);
      expect(onQuantityChange).toHaveBeenNthCalledWith(1, 1, 3);
      expect(onQuantityChange).toHaveBeenNthCalledWith(2, 1, 3);
      expect(onQuantityChange).toHaveBeenNthCalledWith(3, 1, 3);
    });

    it('does nothing when onQuantityChange is not provided', () => {
      renderOrderItem({ showQuantityControls: true });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
    });
  });

  describe('Remove Functionality', () => {
    it('shows remove button when showRemove is true', () => {
      const onRemove = vi.fn();
      
      renderOrderItem({ showRemove: true, onRemove });

      const removeIcons = document.querySelectorAll('[class*="removeIcon"]');
      expect(removeIcons.length).toBeGreaterThan(0);
    });

    it('does not show remove button by default', () => {
      renderOrderItem();

      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('calls onRemove with item id when remove button is clicked', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      
      renderOrderItem({ showRemove: true, onRemove });

      const svgElements = document.querySelectorAll('svg');
      const xIcon = Array.from(svgElements).find((svg) => 
        svg.className.baseVal?.includes('removeIcon') || 
        svg.getAttribute('class')?.includes('removeIcon')
      );
      
      expect(xIcon).toBeTruthy();
      if (xIcon) {
        await user.click(xIcon);
        expect(onRemove).toHaveBeenCalledWith(1);
      }
    });

    it('does not show remove button when onRemove is not provided', () => {
      renderOrderItem({ showRemove: true });

      const svgElements = document.querySelectorAll('svg');
      const xIcon = Array.from(svgElements).find((svg) => 
        svg.parentElement?.className.includes('removeIcon')
      );
      
      expect(xIcon).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long product titles with line clamp', () => {
      const item = {
        ...mockItem,
        title: 'This is a very long product title that should be truncated after two lines to prevent layout issues',
      };
      renderOrderItem({ item });

      expect(screen.getByText(item.title)).toBeInTheDocument();
    });

    it('handles zero price correctly', () => {
      const item = { ...mockItem, price: 0, quantity: 1 };
      renderOrderItem({ item });

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles large quantities', () => {
      const item = { ...mockItem, quantity: 999 };
      renderOrderItem({ item });

      expect(screen.getByText(/qty: 999/i)).toBeInTheDocument();
    });

    it('handles decimal prices correctly', () => {
      const item = { ...mockItem, price: 19.99, quantity: 5 };
      renderOrderItem({ item });

      expect(screen.getByText('$99.95')).toBeInTheDocument();
    });

    it('renders without crashing with minimal props', () => {
      renderOrderItem();

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});
