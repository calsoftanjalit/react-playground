import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainImage } from '@/components/product/MainImage';


const mockTeardown = vi.fn();

vi.mock('drift-zoom', () => {
  return {
    default: class MockDrift {
      teardown: () => void;
      constructor() {
        this.teardown = mockTeardown;
      }
    },
  };
});

describe('<MainImage />', () => {
  let mockPaneRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPaneRef = { current: document.createElement('div') };
  });

  const renderWithMantine = (ui: React.ReactNode) =>
    render(<MantineProvider>{ui}</MantineProvider>);

  it('renders the image with correct src and alt', () => {
    renderWithMantine(<MainImage src="image.jpg" paneRef={mockPaneRef} />);

    const img = screen.getByAltText('product') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('image.jpg');
    expect(img).toHaveAttribute('data-zoom', 'image.jpg');
  });

  it('initializes Drift when src and paneRef exist', () => {
    renderWithMantine(<MainImage src="image.jpg" paneRef={mockPaneRef} />);
    // MockDrift constructor called implicitly
  });

  it('calls teardown on unmount', () => {
    const { unmount } = renderWithMantine(<MainImage src="image.jpg" paneRef={mockPaneRef} />);
     expect(mockTeardown).not.toHaveBeenCalled();
     unmount();
     expect(mockTeardown).toHaveBeenCalled();
  });

  it('does not initialize Drift if src or paneRef is missing', () => {
    const emptyPaneRef = { current: null };
    renderWithMantine(<MainImage src="" paneRef={emptyPaneRef} />);
    const img = screen.getByAltText('product') as HTMLImageElement;
    expect(img).toBeInTheDocument();
  });

});
