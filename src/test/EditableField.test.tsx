import { render, screen } from "@testing-library/react";
import { MantineProvider, TextInput } from "@mantine/core";
import { describe, it, expect } from "vitest";
import { EditableField } from "@/pages/EditableField";
import { IconUser } from "@tabler/icons-react";
import { ReactNode } from "react";

const renderWithMantine = (ui: ReactNode) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("EditableField", () => {
  it("renders display value when not editing", () => {
    renderWithMantine(
      <EditableField
        icon={<IconUser />}
        label="Full Name"
        isEditing={false}
        displayValue="Test User"
      />
    );

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders TextInput when editing and inputProps are provided", () => {
    renderWithMantine(
      <EditableField
        icon={<IconUser />}
        label="Username"
        isEditing={true}
        displayValue="testuser"
        inputProps={{ value: "testuser", onChange: () => {} }}
      />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByText("testuser")).not.toBeInTheDocument();
  });

  it("renders custom inputs when renderInputs is provided", () => {
    renderWithMantine(
      <EditableField
        icon={<IconUser />}
        label="Full Name"
        isEditing={true}
        displayValue="Test User"
        renderInputs={() => (
          <>
            <TextInput value="Test" readOnly />
            <TextInput value="User" readOnly />
          </>
        )}
      />
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });

  it("does not render TextInput when not editing even if inputProps exist", () => {
    renderWithMantine(
      <EditableField
        icon={<IconUser />}
        label="Email"
        isEditing={false}
        displayValue="test@example.com"
        inputProps={{ value: "test@example.com", onChange: () => {} }}
      />
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
