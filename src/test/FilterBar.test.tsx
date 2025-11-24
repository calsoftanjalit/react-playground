import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '@/components/product';

vi.mock('@/components/product/Search', () => ({
  Search: () => <div>Mock Search</div>,
}));

vi.mock('@/components/product/Category', () => ({
  Category: () => <div>Mock Category</div>,
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<FilterBar /> Component', () => {
  it('renders Search and Category components inside layout', () => {
    renderWithMantine(<FilterBar />);

    expect(screen.getByText('Mock Search')).toBeInTheDocument();
    expect(screen.getByText('Mock Category')).toBeInTheDocument();
  });

  it('renders within a wrapper container', () => {
    const { container } = renderWithMantine(<FilterBar />);
    const wrapper = container.querySelector('div');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.textContent).toContain('Mock Search');
    expect(wrapper?.textContent).toContain('Mock Category');
  });
});
