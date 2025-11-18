import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { CommonBreadcrumb } from '@/components/breadcrumbs/CommonBreadcrumb';


const renderWithRouter = (initialEntries: string[]) =>
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <CommonBreadcrumb />
      </MemoryRouter>
    </MantineProvider>
  );

describe('CommonBreadcrumb', () => {
  it('renders Home for root path', () => {
    renderWithRouter(['/']);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders Home › About for /about', () => {
    renderWithRouter(['/about']);
    expect(screen.getByText('/about')).toBeInTheDocument();
  });

  it('renders Home › Cart for /cart', () => {
    renderWithRouter(['/cart']);
    expect(screen.getByText('/cart')).toBeInTheDocument();
  });
});
