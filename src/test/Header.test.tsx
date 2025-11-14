import { Header } from "@/components/Header/Header";
import { MantineProvider } from "@mantine/core";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("Header Component", () => {
  const mockToggle = vi.fn();

  const setup = () =>
    render(
      <MantineProvider>
        <BrowserRouter>
          <Header opened={false} toggle={mockToggle} />
        </BrowserRouter>
      </MantineProvider>
    );

  it("renders the title", () => {
    setup();
    expect(screen.getByText("MyShop")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    setup();

    const links = ["Home", "Products", "Cart", "Checkout"];

    links.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("renders the burger menu button", () => {
    setup();
    const burger = screen.getByRole("button"); // Burger component renders a <button>
    expect(burger).toBeInTheDocument();
  });

  it("calls toggle when burger is clicked", () => {
    setup();

    const burger = screen.getByRole("button");
    fireEvent.click(burger);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
