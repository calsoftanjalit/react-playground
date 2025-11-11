import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopularProducts } from '@/components/home/PopularProducts';
import { MantineProvider } from '@mantine/core';

describe('PopularProducts', () => {
  it('renders all products correctly', () => {
    render(
      <MantineProvider>
        <PopularProducts />
      </MantineProvider>
    );

    expect(screen.getByText('Popular Products')).toBeInTheDocument();
    expect(screen.getAllByText(/Premium Product/)).toHaveLength(4);
    expect(screen.getAllByText('Add to Cart')).toHaveLength(4);
  });

  it('displays product prices', () => {
    render(
      <MantineProvider>
        <PopularProducts />
      </MantineProvider>
    );
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  it('has clickable add to cart buttons', async () => {
    render(
      <MantineProvider>
        <PopularProducts />
      </MantineProvider>
    );
    const user = userEvent.setup();

    const buttons = screen.getAllByText('Add to Cart');
    await user.click(buttons[0]);

    expect(buttons[0]).toBeInTheDocument();
  });
});
