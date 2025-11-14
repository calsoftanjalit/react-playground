import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartIcon from '@/components/Cart/CartIcon';

vi.mock('@/context', () => ({
  useCartStore: vi.fn(),
}));

import { useCartStore } from '@/context';

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<CartIcon /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the cart icon and item count', () => {
    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      totalItems: 3,
    });

    renderWithMantine(<CartIcon />);

    expect(screen.getByText('3')).toBeInTheDocument();

    const svg = screen.getByText('3').previousSibling as SVGElement;
    expect(svg.tagName.toLowerCase()).toBe('svg');

    const wrapper = screen.getByText('3').closest('div');
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('cursor-pointer');
  });

  it('renders 0 when totalItems is zero', () => {
    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      totalItems: 0,
    });

    renderWithMantine(<CartIcon />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('updates when totalItems changes', () => {
    (useCartStore as ReturnType<typeof vi.fn>).mockReturnValue({
      totalItems: 10,
    });

    renderWithMantine(<CartIcon />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
