import { render, screen, fireEvent } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';
import { vi } from 'vitest';
import { Search } from '@/components/product';
import { MantineProvider } from '@mantine/core';

vi.mock('@/hooks/useSearch');

const renderWithMantine = (ui: React.ReactNode) =>
  render(
    <MantineProvider>{ui}</MantineProvider>
  );

describe('Search Component', () => {
  const setInput = vi.fn();

  const mockUseSearch = (value: string = '') => {
    vi.mocked(useSearch).mockReturnValue({
      input: value,
      setInput,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });



  it('renders input element correctly', () => {
    mockUseSearch('');
    renderWithMantine(<Search />);

    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument();
  });

  it('displays value from store', () => {
    mockUseSearch('Laptop');
    renderWithMantine(<Search />);

    const inputEl = screen.getByPlaceholderText('Search products')
    expect(inputEl).toHaveValue('Laptop')
  });

  it('calls setInput on typing', () => {
    mockUseSearch('');
    renderWithMantine(<Search />);

    const inputEl = screen.getByPlaceholderText('Search products');
    fireEvent.change(inputEl, { target: { value: 'Phone' } });

    expect(setInput).toHaveBeenCalledTimes(1);
    expect(setInput).toHaveBeenCalledWith('Phone');
  });

  it('allows clearing input to empty string', () => {
    mockUseSearch('Books');
    renderWithMantine(<Search />);

    const inputEl = screen.getByPlaceholderText('Search products');
    fireEvent.change(inputEl, { target: { value: '' } });

    expect(setInput).toHaveBeenCalledWith('');
  });

  it('reflects updated controlled value', () => {
    mockUseSearch('Camera');
    const { rerender } = renderWithMantine(<Search />);

    let inputEl = screen.getByPlaceholderText('Search products')
    expect(inputEl).toHaveValue('Camera');

    mockUseSearch('Updated');
    rerender(
      <MantineProvider>
        <Search />
      </MantineProvider>
    );

    inputEl = screen.getByPlaceholderText('Search products')
    expect(inputEl).toHaveValue('Updated')
  });
});
