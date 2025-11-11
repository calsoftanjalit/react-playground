import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../components/layout";

describe("Navbar", () => {
  const mockToggle = vi.fn();

  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={false} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders the correct number of navigation items", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={false} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home");
    const aboutLink = screen.getByText("About");

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });
});
