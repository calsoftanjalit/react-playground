import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header/Header';

const renderHeader = (opened = false, toggle = vi.fn(), initialRoute = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MantineProvider>
        <Header opened={opened} toggle={toggle} />
      </MantineProvider>
    </MemoryRouter>
  );

describe('<Header />', () => {
  it('renders the header title', () => {
    renderHeader();
    expect(screen.getByText('MyShop')).toBeInTheDocument();
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

    const title = screen.getByText('MyShop');
    const icon = title.previousSibling as SVGElement;

    expect(icon?.tagName.toLowerCase()).toBe('svg');
  });

  it('renders all navigation links', () => {
    renderHeader();

    ['Home', 'Products', 'Cart', 'Checkout'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('applies active class to current route', () => {
    renderHeader(false, vi.fn(), '/products');

    const productsLink = screen.getByText('Products');
    expect(productsLink.className).toContain('activeLink');
  });

  it('applies inactive class to non-active routes', () => {
    renderHeader(false, vi.fn(), '/products');

    const homeLink = screen.getByText('Home');
    expect(homeLink.className).toContain('inactiveLink');
  });
});
