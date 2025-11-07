import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { DevelopmentTimeline } from "../components/about";

describe("DevelopmentTimeline", () => {
  it("renders the timeline heading", () => {
    render(
      <MantineProvider>
        <DevelopmentTimeline />
      </MantineProvider>
    );

    expect(screen.getByText("Development Timeline")).toBeInTheDocument();
  });

  it("renders all timeline items", () => {
    render(
      <MantineProvider>
        <DevelopmentTimeline />
      </MantineProvider>
    );

    expect(screen.getByText("Project Setup")).toBeInTheDocument();
    expect(screen.getByText("UI Integration")).toBeInTheDocument();
    expect(screen.getByText("Data Management")).toBeInTheDocument();
    expect(screen.getByText("Routing & Navigation")).toBeInTheDocument();
  });

  it("renders timeline item descriptions", () => {
    render(
      <MantineProvider>
        <DevelopmentTimeline />
      </MantineProvider>
    );

    expect(
      screen.getByText(/Initialized with Vite, React, and TypeScript/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Added Mantine UI and Tailwind CSS/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Integrated TanStack Query for data fetching/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Implemented React Router with Mantine layout/i)
    ).toBeInTheDocument();
  });
});
