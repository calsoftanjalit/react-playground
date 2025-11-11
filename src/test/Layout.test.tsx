import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { Layout } from "../components/layout";

vi.mock("../components/layout/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock("../components/layout/Navbar", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

describe("Layout", () => {
  it("renders the layout with header and navbar", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Layout />
        </MantineProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
});
