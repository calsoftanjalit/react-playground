import { LoadingIndicator } from '@/components/miscellaneous/LoadingIndicator';
import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LoadingIndicator', () => {
  it('should render the loading indicator component', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingIndicator />
      </MantineProvider>
    );

    const loader = container.querySelector('.mantine-Loader-root');
    expect(loader).toBeInTheDocument();
  });

  it('should render inside a div container', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingIndicator />
      </MantineProvider>
    );

    const divContainer = container.querySelector('div > div');
    expect(divContainer).toBeInTheDocument();
  });

  it('should render a large loader', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingIndicator />
      </MantineProvider>
    );

    const loader = container.querySelector('.mantine-Loader-root');
    expect(loader).toHaveAttribute('data-size', 'lg');
  });

  it('should render the Loader component from Mantine', () => {
    const { container } = render(
      <MantineProvider>
        <LoadingIndicator />
      </MantineProvider>
    );

    const loader = container.querySelector('.mantine-Loader-root');
    expect(loader).toBeInTheDocument();
  });
});
