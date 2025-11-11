import { render, screen } from '@testing-library/react';

import { vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { HomePage } from '@/pages';

vi.mock('../components/home', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
  FeaturedCategories: () => <div data-testid="featured-categories">Featured Categories</div>,
  PopularProducts: () => <div data-testid="popular-products">Popular Products</div>,
  PostList: () => <div data-testid="post-list">Post List</div>,
}));

vi.mock('../components/miscellaneous', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

describe('HomePage', () => {
  it('renders all sections in correct order', () => {
    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    const sections = screen.getAllByTestId(/section|featured|products|post|footer/);
    expect(sections).toHaveLength(5);
    expect(sections.map((s) => s.textContent)).toEqual([
      'Hero Section',
      'Featured Categories',
      'Popular Products',
      'Post List',
      'Footer',
    ]);
  });
});
