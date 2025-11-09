import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { PostList } from "../components/home";
import * as postService from "../services/postService";

vi.mock("../components/miscellaneous", () => ({
  LoaderComponent: () => <div data-testid="loader">Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

vi.mock("../components/home/Post", () => ({
  default: ({ title, body }: { title: string; body: string }) => (
    <div data-testid="post">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  ),
}));

vi.mock("../services/postService", () => ({
  fetchPosts: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
  return render(
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MantineProvider>
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PostList Component", () => {
  it("renders loader while fetching posts", () => {
    vi.spyOn(postService, "fetchPosts").mockReturnValue(new Promise(() => {}));

    renderWithProviders(<PostList />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders error message when fetch fails", async () => {
    vi.spyOn(postService, "fetchPosts").mockRejectedValue(new Error("Failed to fetch"));

    renderWithProviders(<PostList />);
    const errorEl = await screen.findByTestId("error");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent("Failed to fetch");
  });

  it("renders posts when fetch succeeds", async () => {
    const mockPosts = [
      { id: 1, title: "Post 1", body: "Body 1" },
      { id: 2, title: "Post 2", body: "Body 2" },
    ];

    vi.spyOn(postService, "fetchPosts").mockResolvedValue(mockPosts);

    renderWithProviders(<PostList />);

    const posts = await screen.findAllByTestId("post");
    expect(posts).toHaveLength(2);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();

    expect(screen.getByText(/post list/i)).toBeInTheDocument();
  });
});
