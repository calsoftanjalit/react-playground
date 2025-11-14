import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/layout';
import { MemoryRouter } from 'react-router-dom';

describe('Header', () => {
  const mockToggle = vi.fn();

  it('renders the header with logo and title', () => {
    render(
      <MemoryRouter>
        <MantineProvider>
          <Header opened={false} toggle={mockToggle} />
        </MantineProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('React Playground')).toBeInTheDocument();
  });

  it('renders the burger menu', () => {
    render(
      <MemoryRouter>
        <MantineProvider>
          <Header opened={false} toggle={mockToggle} />
        </MantineProvider>
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
