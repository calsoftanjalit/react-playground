import { render, screen } from "@testing-library/react";
import { HomePage } from "../pages";

import { vi } from "vitest";
import { MantineProvider } from "@mantine/core";

vi.mock("../components/home", () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
  FeaturedCategories: () => (
    <div data-testid="featured-categories">Featured Categories</div>
  ),
  PopularProducts: () => (
    <div data-testid="popular-products">Popular Products</div>
  ),
  PostList: () => <div data-testid="post-list">Post List</div>,
}));

vi.mock("../components/miscellaneous", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

describe("HomePage", () => {
  it("renders all sections in correct order", () => {
    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    const sections = screen.getAllByTestId(/section|featured|products|post|footer/);
    expect(sections).toHaveLength(5);
    expect(sections[0]).toHaveTextContent("Hero Section");
    expect(sections[1]).toHaveTextContent("Featured Categories");
    expect(sections[2]).toHaveTextContent("Popular Products");
    expect(sections[3]).toHaveTextContent("Post List");
    expect(sections[4]).toHaveTextContent("Footer");
  });
});
