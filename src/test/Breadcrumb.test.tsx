import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Breadcrumb } from '@/components/breadcrumbs/Breadcrumb';

const renderWithRouter = (initialEntries: string[]) =>
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Breadcrumb />
      </MemoryRouter>
    </MantineProvider>
  );

describe('CommonBreadcrumb', () => {
  it('renders Home › About for /about', () => {
    renderWithRouter(['/about']);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders Home › Cart for /cart', () => {
    renderWithRouter(['/cart']);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  it('renders Home › Products › 122 for /products/122', () => {
    renderWithRouter(['/products/122']);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('122')).toBeInTheDocument();
  });

  it('renders Home › Products › IPhone6 for /products/IPhone6', () => {
    renderWithRouter(['/products/IPhone6']);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('IPhone6')).toBeInTheDocument();
  });
});
