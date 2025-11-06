import { render, screen } from "@testing-library/react";
import { FeaturedCategories } from "./FeaturedCategories";
import { MantineProvider } from "@mantine/core";

describe("FeaturedCategories", () => {
  it("renders all categories correctly", () => {
    render(
      <MantineProvider>
        <FeaturedCategories />
      </MantineProvider>
    );

    expect(screen.getByText("Featured Categories")).toBeInTheDocument();
    expect(screen.getByText("Premium Collection")).toBeInTheDocument();
    expect(screen.getByText("New Arrivals")).toBeInTheDocument();
    expect(screen.getByText("Best Sellers")).toBeInTheDocument();
  });

  it("renders category descriptions", () => {
    render(
      <MantineProvider>
        <FeaturedCategories />
      </MantineProvider>
    );

    expect(
      screen.getByText("Discover luxury items crafted for excellence")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Shop the latest trends and styles")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Our most popular items chosen by customers")
    ).toBeInTheDocument();
  });
});
