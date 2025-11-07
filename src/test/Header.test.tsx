import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/layout";

describe("Header", () => {
  const mockToggle = vi.fn();

  it("renders the header with logo and title", () => {
    render(
      <MantineProvider>
        <Header opened={false} toggle={mockToggle} />
      </MantineProvider>
    );

    expect(screen.getByText("React Playground")).toBeInTheDocument();
  });

  it("renders the burger menu", () => {
    render(
      <MantineProvider>
        <Header opened={false} toggle={mockToggle} />
      </MantineProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
