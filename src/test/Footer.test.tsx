import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Footer } from "@components/miscellaneous";

describe("Footer", () => {
  it("renders all footer sections", () => {
    render(
      <MantineProvider>
        <Footer />
      </MantineProvider>
    );

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Customer Service")).toBeInTheDocument();
    expect(screen.getByText("Shopping")).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("renders copyright notice", () => {
    render(
      <MantineProvider>
        <Footer />
      </MantineProvider>
    );

    expect(screen.getByText(/© 2025 Your Brand Name/)).toBeInTheDocument();
  });

  it("renders all footer links", () => {
    render(
      <MantineProvider>
        <Footer />
      </MantineProvider>
    );

    const links = [
      "Our Story",
      "Careers",
      "Press",
      "Contact Us",
      "FAQ",
      "New Arrivals",
      "Best Sellers",
      "Sale",
      "Instagram",
      "Facebook",
      "Twitter",
    ];

    for (const link of links) {
      expect(screen.getByText(link)).toBeInTheDocument();
    }
  });
});
