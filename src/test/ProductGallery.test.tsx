import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi } from 'vitest';
import { ProductGallery } from '@/components/product/ProductGallery';
import { useEffect } from 'react';

const mockTeardown = vi.fn();

vi.mock('@/components/product/MainImage', () => ({
  MainImage: ({ src, paneRef }: { src: string; paneRef: React.RefObject<HTMLDivElement> }) => {
    useEffect(() => {
      const driftInstance = { teardown: mockTeardown };
      return () => driftInstance.teardown();
    }, [src, paneRef]);

    return (
      <div
        data-testid="main-image"
        data-src={src}
        data-has-pane-ref={!!paneRef}
      />
    );
  },
}));


vi.mock('@/components/product/ThumbnailList', () => ({
  ThumbnailList: ({
    images,
    mainImage,
    onSelect,
  }: {
    images: string[];
    mainImage: string;
    onSelect: (img: string) => void;
  }) => (
    <div>
      {images.map((img) => (
        <button key={img} data-testid={`thumbnail-${img}`} onClick={() => onSelect(img)}>
          {img}
        </button>
      ))}
      <div data-testid="selected-thumbnail">{mainImage}</div>
    </div>
  ),
}));

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('<ProductGallery />', () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main image and thumbnails initially', () => {
    renderWithMantine(<ProductGallery images={images} />);

    const mainImage = screen.getByTestId('main-image');
    expect(mainImage).toHaveAttribute('data-src', 'img1.jpg');

    images.forEach((img) => {
      expect(screen.getByTestId(`thumbnail-${img}`)).toBeInTheDocument();
    });

    expect(screen.getByTestId('selected-thumbnail')).toHaveTextContent('img1.jpg');
  });

  it('updates main image when a thumbnail is clicked', () => {
    renderWithMantine(<ProductGallery images={images} />);

    const thumbnailBtn = screen.getByTestId('thumbnail-img2.jpg');
    fireEvent.click(thumbnailBtn);

    const mainImage = screen.getByTestId('main-image');
    expect(mainImage).toHaveAttribute('data-src', 'img2.jpg');
    expect(screen.getByTestId('selected-thumbnail')).toHaveTextContent('img2.jpg');
  });

  it('passes paneRef to MainImage', () => {
      renderWithMantine(<ProductGallery images={images} />);
      const mainImage = screen.getByTestId('main-image');

      const paneRefAttr = mainImage.getAttribute('data-has-pane-ref');
      expect(paneRefAttr).toBe('true');
  });

  it('calls teardown when MainImage unmounts', () => {
    const { unmount } = renderWithMantine(<ProductGallery images={images} />);
    expect(mockTeardown).not.toHaveBeenCalled();
    unmount();
    expect(mockTeardown).toHaveBeenCalled();
  });
});
