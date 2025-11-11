import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { AboutHero } from "../components/about";

describe("AboutHero", () => {
  it("renders the about hero section", () => {
    render(
      <MantineProvider>
        <AboutHero />
      </MantineProvider>
    );

    expect(screen.getByText("About This Project")).toBeInTheDocument();
    expect(screen.getByText("React Playground")).toBeInTheDocument();
    expect(
      screen.getByText(
        /A comprehensive development environment for modern React applications/i
      )
    ).toBeInTheDocument();
  });

  it("renders badge with correct variant", () => {
    render(
      <MantineProvider>
        <AboutHero />
      </MantineProvider>
    );

    const badge = screen.getByText("About This Project");
    expect(badge).toBeInTheDocument();
  });
});
