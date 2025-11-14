import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "@/components/home/QuantitySelector";
import { MantineProvider } from "@mantine/core";

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe("QuantitySelector", () => {
  it("should render with initial quantity", () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();

    renderWithMantine(
      <QuantitySelector
        quantity={5}
        handleIncrement={mockIncrement}
        handleDecrement={mockDecrement}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should call handleIncrement when + button is clicked", async () => {
    const user = userEvent.setup();
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();

    renderWithMantine(
      <QuantitySelector
        quantity={1}
        handleIncrement={mockIncrement}
        handleDecrement={mockDecrement}
      />
    );

    const incrementButton = screen.getAllByRole("button")[1];
    await user.click(incrementButton);

    expect(mockIncrement).toHaveBeenCalledOnce();
  });

  it("should call handleDecrement when - button is clicked", async () => {
    const user = userEvent.setup();
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();

    renderWithMantine(
      <QuantitySelector
        quantity={5}
        handleIncrement={mockIncrement}
        handleDecrement={mockDecrement}
      />
    );

    const decrementButton = screen.getAllByRole("button")[0];
    await user.click(decrementButton);

    expect(mockDecrement).toHaveBeenCalledOnce();
  });

  it("should display different quantities correctly", () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    const quantities = [1, 5, 10, 100];

    for (const qty of quantities) {
      const { unmount } = renderWithMantine(
        <QuantitySelector
          quantity={qty}
          handleIncrement={mockIncrement}
          handleDecrement={mockDecrement}
        />
      );

      expect(screen.getByText(qty.toString())).toBeInTheDocument();
      unmount();
    }
  });
});
