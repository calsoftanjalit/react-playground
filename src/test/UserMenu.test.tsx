import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { UserMenu } from "../components/layout";

describe("UserMenu", () => {
  it("renders the user menu button", () => {
    render(
      <MantineProvider>
        <UserMenu />
      </MantineProvider>
    );

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
  });
});
