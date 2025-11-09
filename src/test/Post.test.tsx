import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MantineProvider } from "@mantine/core";
import { PostInterface } from "../types/post";
import Post from "../components/home/Post";

describe("Post component", () => {
  const mockPost: PostInterface = {
    id: 1,
    title: "test title",
    body: "this is a test body",
  };

  const renderWithMantine = (ui: React.ReactNode) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
  };

  it("renders without crashing", () => {
    renderWithMantine(<Post {...mockPost} />);
    expect(screen.getByText("test title")).toBeInTheDocument();
    expect(screen.getByText("this is a test body")).toBeInTheDocument();
  });

  it("renders the correct title", () => {
    renderWithMantine(<Post {...mockPost} />);
    expect(screen.getByText("test title")).toBeInTheDocument();
  });

  it("renders the correct body text", () => {
    renderWithMantine(<Post {...mockPost} />);
    expect(screen.getByText("this is a test body")).toBeInTheDocument();
  });

  it("renders correctly with different post data", () => {
    const newPost: PostInterface = {
      id: 2,
      title: "another post",
      body: "different body content",
    };

    renderWithMantine(<Post {...newPost} />);
    expect(screen.getByText("another post")).toBeInTheDocument();
    expect(screen.getByText("different body content")).toBeInTheDocument();
  });
});
