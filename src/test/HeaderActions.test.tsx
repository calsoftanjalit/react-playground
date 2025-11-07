import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { HeaderActions } from "../components/layout";

describe("HeaderActions", () => {
  it("renders all action buttons", () => {
    render(
      <MantineProvider>
        <HeaderActions />
      </MantineProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("renders GitHub link", () => {
    render(
      <MantineProvider>
        <HeaderActions />
      </MantineProvider>
    );

    const githubLink = screen.getByRole("link");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/calsoftanjalit/react-playground"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
  });
});
