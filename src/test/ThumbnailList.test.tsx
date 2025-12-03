import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import { ThumbnailList } from '@/components/product/ThumbnailList';
import { ThumbnailListProps } from '@/types';

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<ThumbnailList />', () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
  const mockOnSelect = vi.fn();

  const defaultProps: ThumbnailListProps = {
    images,
    mainImage: 'img2.jpg',
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all thumbnail images', () => {
    renderWithMantine(<ThumbnailList {...defaultProps} />);

    const thumbs = screen.getAllByAltText('thumb');
    expect(thumbs).toHaveLength(images.length);
    thumbs.forEach((img, index) => {
      expect(img).toHaveAttribute('src', images[index]);
    });
  });

  it('applies active class to the selected thumbnail', () => {
    renderWithMantine(<ThumbnailList {...defaultProps} />);

    const allThumbs = screen.getAllByAltText('thumb').map((img) => img.closest('div'));
    const activeThumb = allThumbs[1];
    expect(activeThumb).toHaveClass(/active/);
  });

  it('calls onSelect when a thumbnail is clicked', () => {
    renderWithMantine(<ThumbnailList {...defaultProps} />);

    const firstThumb = screen.getAllByAltText('thumb')[0].closest('div')!;
    fireEvent.click(firstThumb);
    expect(mockOnSelect).toHaveBeenCalledWith('img1.jpg');
  });
});
