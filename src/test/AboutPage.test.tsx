import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AboutPage } from "../pages";

vi.mock("../components/about", () => ({
  AboutHero: () => <div data-testid="about-hero">About Hero</div>,
  TechStack: () => <div data-testid="tech-stack">Tech Stack</div>,
  DevelopmentTimeline: () => (
    <div data-testid="development-timeline">Development Timeline</div>
  ),
}));

describe("AboutPage", () => {
  it("renders all about sections in correct order", () => {
    render(
      <MantineProvider>
        <AboutPage />
      </MantineProvider>
    );

    const hero = screen.getByTestId("about-hero");
    const techStack = screen.getByTestId("tech-stack");
    const timeline = screen.getByTestId("development-timeline");

    expect(hero).toBeInTheDocument();
    expect(techStack).toBeInTheDocument();
    expect(timeline).toBeInTheDocument();
  });

  it("renders call to action message", () => {
    render(
      <MantineProvider>
        <AboutPage />
      </MantineProvider>
    );

    expect(
      screen.getByText(/Ready to build something amazing/i)
    ).toBeInTheDocument();
  });
});
