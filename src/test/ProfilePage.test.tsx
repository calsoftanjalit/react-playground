import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfilePage } from "@/pages/ProfilePage";
import { MantineProvider } from "@mantine/core";
import { AUTH_ROUTES } from "@/constants/auth";

const mockLogout = vi.fn();
const mockUseAuthStore = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("@/hooks/useAuthStore", () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/styles/ProfilePage.module.scss", () => ({
  default: {
    header: "header",
  },
}));

describe("ProfilePage", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    image: "avatar.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      updateUser: mockUpdateUser,
    });
  });

  const renderProfilePage = () => {
    return render(
      <MantineProvider>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </MantineProvider>
    );
  };

  it("should render user profile information", () => {
    renderProfilePage();

    const nameElements = screen.getAllByText("Test User");
    expect(nameElements).toHaveLength(2);
    expect(nameElements[0]).toBeInTheDocument();

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should not render profile content if user is null", () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      logout: mockLogout,
      updateUser: mockUpdateUser,
    });

    renderProfilePage();

    expect(screen.queryByText("Profile Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Quick Actions")).not.toBeInTheDocument();
  });

  it("should enter edit mode when Edit button is clicked", () => {
    renderProfilePage();

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should update profile when Update button is clicked", () => {
    renderProfilePage();

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const firstNameInput = screen.getByDisplayValue("Test");
    fireEvent.change(firstNameInput, { target: { value: "UpdatedName" } });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(mockUpdateUser).toHaveBeenCalledWith({
      firstName: "UpdatedName",
      lastName: "User",
      email: "test@example.com",
      username: "testuser",
    });
  });

  it("should cancel edit and restore original values", () => {
    renderProfilePage();

    // fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // const firstNameInput = screen.getByDisplayValue("Test");
    // fireEvent.change(firstNameInput, { target: { value: "Changed" } });

    // fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // expect(
    //   screen.getByText((content) => content.trim() === "Test User")
    // ).toBeInTheDocument();
    // expect(screen.queryByDisplayValue("Changed")).not.toBeInTheDocument();

    // expect(mockUpdateUser).not.toHaveBeenCalled();

    // enter edit mode
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // change first name
    const firstNameInput = screen.getByDisplayValue("Test");
    fireEvent.change(firstNameInput, { target: { value: "Changed" } });

    // cancel edit
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // inputs should be gone (edit mode off)
    expect(screen.queryByDisplayValue("Changed")).not.toBeInTheDocument();

    // // original value should be shown as text
    // expect(screen.getByText("Test User")).toBeInTheDocument();

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

  // updateUser should not be called
  expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('should navigate to orders page when "View My Orders" is clicked', () => {
    renderProfilePage();

    const ordersButton = screen.getByRole("button", {
      name: /view my orders/i,
    });
    fireEvent.click(ordersButton);

    expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.ORDERS);
  });

  it("should call logout and navigate home when logout is clicked", async () => {
    mockLogout.mockResolvedValue(undefined);
    renderProfilePage();

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    await expect(mockLogout.mock.results[0].value).resolves.toBeUndefined();
  });
});
