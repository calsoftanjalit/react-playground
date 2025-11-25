import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { Navbar } from "../components/layout";

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe("Navbar", () => {
  const mockToggle = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useLocation as Mock).mockReturnValue({ pathname: '/' });
  });

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

  it("should navigate to the correct path when a nav item is clicked", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={false} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    const aboutLink = screen.getByText("About");
    fireEvent.click(aboutLink);

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it("should call toggle function when navbar is opened and a nav item is clicked", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={true} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home");
    fireEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockToggle).toHaveBeenCalled();
  });

  it("should not call toggle function when navbar is closed and a nav item is clicked", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={false} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home");
    fireEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockToggle).not.toHaveBeenCalled();
  });

  it("should mark the current page as active", () => {
    (useLocation as Mock).mockReturnValue({ pathname: '/about' });
    
    render(
      <BrowserRouter>
        <MantineProvider>
          <Navbar opened={false} toggle={mockToggle} />
        </MantineProvider>
      </BrowserRouter>
    );

    const aboutLink = screen.getByText("About").closest('a');
    expect(aboutLink).toHaveAttribute('data-active', 'true');
  });
});
