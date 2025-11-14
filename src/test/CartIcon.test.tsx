import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect } from 'vitest';
import CartIcon from '@/components/Cart/CartIcon';

// Utility to render with Mantine context
const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<CartIcon /> component', () => {
  it('renders without crashing', () => {
    renderWithMantine(<CartIcon />);

    // The count text "0" should render
    const countText = screen.getByText('0');
    expect(countText).toBeInTheDocument();

    // The SVG icon (react-icons render as <svg>)
    const svgIcon = countText.previousSibling as SVGElement | null;
    expect(svgIcon?.tagName.toLowerCase()).toBe('svg');

    // The wrapper should be the parent of both icon and text
    const wrapper = countText.closest('div');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the correct item count text', () => {
    renderWithMantine(<CartIcon />);
    const countText = screen.getByText('0');
    expect(countText).toHaveTextContent('0');
  });

  it('applies expected layout and styling classes', () => {
    renderWithMantine(<CartIcon />);
    const countText = screen.getByText('0');
    const wrapper = countText.closest('div');
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('cursor-pointer');
  });
});
