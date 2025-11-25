import { LoadingFallback } from '@/components/common/LoadingFallback';
import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LoadingFallback', () => {
  it('should render the loading fallback component', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingFallback />
      </MantineProvider>
    );

    const loader = container.querySelector('.mantine-Loader-root');
    expect(loader).toBeInTheDocument();
  });

  it('should render with full viewport height', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingFallback />
      </MantineProvider>
    );

    const centerDiv = container.querySelector('.mantine-Center-root');
    expect(centerDiv).toBeInTheDocument();
    expect(centerDiv).toHaveStyle('height: 768px');
  });

  it('should render a large loader', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingFallback />
      </MantineProvider>
    );

    const loader = container.querySelector('.mantine-Loader-root');
    expect(loader).toHaveAttribute('data-size', 'lg');
  });
});
