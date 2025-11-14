import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/layout';

// Mock HeaderActions
vi.mock('@/components/layout/HeaderActions', () => ({
  HeaderActions: () => <div>Mock Header Actions</div>,
}));

const renderHeader = (opened = false, toggle = vi.fn()) =>
  render(
    <MemoryRouter>
      <MantineProvider>
        <Header opened={opened} toggle={toggle} />
      </MantineProvider>
    </MemoryRouter>
  );

describe('<Header />', () => {
  it('renders the header title', () => {
    renderHeader();
    expect(screen.getByText('React Playground')).toBeInTheDocument();
  });

  it('renders the burger menu button', () => {
    renderHeader();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls toggle when burger menu is clicked', () => {
    const mockToggle = vi.fn();
    renderHeader(false, mockToggle);

    fireEvent.click(screen.getByRole('button'));

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders the rocket icon (as svg)', () => {
    renderHeader();

    const title = screen.getByText('React Playground');
    const icon = title.previousSibling as SVGElement;

    expect(icon?.tagName.toLowerCase()).toBe('svg');
  });

  it('renders HeaderActions component', () => {
    renderHeader();
    expect(screen.getByText('Mock Header Actions')).toBeInTheDocument();
  });
});
