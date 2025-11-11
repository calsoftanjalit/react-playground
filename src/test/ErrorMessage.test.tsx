import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MantineProvider } from "@mantine/core";
import { ErrorMessageInterface } from "../types/errorMessage";
import { ErrorMessage } from "../components/miscellaneous";

describe("ErrorMessage component", () => {
  const renderWithMantine = (ui: React.ReactNode) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it("renders the error message text", () => {
    const mockError: ErrorMessageInterface = { message: "Something went wrong" };
    renderWithMantine(<ErrorMessage {...mockError} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render anything when message is empty", () => {
    const mockError: ErrorMessageInterface = { message: "" };
    renderWithMantine(<ErrorMessage {...mockError} />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
