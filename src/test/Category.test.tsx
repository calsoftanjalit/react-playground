import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Category } from '@/components/product/Category';
import { useFilterStore } from '@/hooks/useFilterStore';
import { useQuery } from '@tanstack/react-query';

vi.mock('@/hooks/useFilterStore');
vi.mock('@tanstack/react-query');

const mockSetCategory = vi.fn();

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<Category />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useFilterStore as ReturnType<typeof vi.fn>).mockReturnValue({
      categoryList: '',
      setCategoryList: mockSetCategory,
    });
  });

  it('renders placeholder input initially', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      error: null,
    });

    renderWithMantine(<Category />);
    expect(screen.getByPlaceholderText(/select category/i)).toBeInTheDocument();
  });

  it('renders category list and selects option correctly', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [{ value: 'Fashion', label: 'Fashion' }],
      error: null,
    });

    renderWithMantine(<Category />);

    const selectEl = screen.getByPlaceholderText(/select category/i);
    fireEvent.click(selectEl);

    fireEvent.click(screen.getByText('Fashion'));

    expect(mockSetCategory.mock.calls[0][0]).toBe('Fashion');
  });

  it('displays error styling when API fails', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      error: { message: 'Failed loading categories' },
    });

    renderWithMantine(<Category />);

    const selectEl = screen.getByPlaceholderText(/select category/i);
    expect(selectEl).toHaveAttribute('data-error', 'true');
  });
});
