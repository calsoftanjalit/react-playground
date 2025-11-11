import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { TechStack } from "../components/about";

describe("TechStack", () => {
  it("renders the project overview section", () => {
    render(
      <MantineProvider>
        <TechStack />
      </MantineProvider>
    );

    expect(screen.getByText("Project Overview")).toBeInTheDocument();
    expect(
      screen.getByText(/This React Playground is built with/i)
    ).toBeInTheDocument();
  });

  it("renders UI & Styling technologies", () => {
    render(
      <MantineProvider>
        <TechStack />
      </MantineProvider>
    );

    expect(screen.getByText("🎨 UI & Styling")).toBeInTheDocument();
    expect(screen.getByText("Mantine UI")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    expect(screen.getByText("SCSS Modules")).toBeInTheDocument();
  });

  it("renders Build Tools technologies", () => {
    render(
      <MantineProvider>
        <TechStack />
      </MantineProvider>
    );

    expect(screen.getByText("⚡ Build Tools")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("PostCSS")).toBeInTheDocument();
  });

  it("renders Development technologies", () => {
    render(
      <MantineProvider>
        <TechStack />
      </MantineProvider>
    );

    expect(screen.getByText("🔧 Development")).toBeInTheDocument();
    expect(screen.getByText("TanStack Query")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
    expect(screen.getByText("ESLint")).toBeInTheDocument();
  });
});
