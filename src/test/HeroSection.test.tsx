import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/home/HeroSection';
import { MantineProvider } from '@mantine/core';

describe('HeroSection', () => {
  it('renders hero content correctly', () => {
    render(
      <MantineProvider>
        <HeroSection />
      </MantineProvider>
    );

    expect(screen.getByText('Discover Your Perfect Style')).toBeInTheDocument();
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
});
