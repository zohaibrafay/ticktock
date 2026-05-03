import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormField from "./FormField";

describe("FormField Component", () => {
  it("should render label", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("should render required asterisk", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        required={true}
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should not render asterisk when not required", () => {
    const { container } = render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        required={false}
      />
    );
    const asterisk = container.querySelector(".text-destructive");
    expect(asterisk).not.toBeInTheDocument();
  });

  it("should render text input", () => {
    render(
      <FormField
        id="username"
        label="Username"
        type="text"
        value="john"
        onChange={vi.fn()}
      />
    );
    const input = screen.getByDisplayValue("john");
    expect(input).toHaveAttribute("type", "text");
  });

  it("should render email input", () => {
    render(
      <FormField
        id="email"
        label="Email"
        type="email"
        value="test@example.com"
        onChange={vi.fn()}
      />
    );
    const input = screen.getByDisplayValue("test@example.com");
    expect(input).toHaveAttribute("type", "email");
  });

  it("should render password input", () => {
    render(
      <FormField
        id="password"
        label="Password"
        type="password"
        value="secret"
        onChange={vi.fn()}
      />
    );
    const input = screen.getByDisplayValue("secret");
    expect(input).toHaveAttribute("type", "password");
  });

  it("should render textarea", () => {
    render(
      <FormField
        id="description"
        label="Description"
        type="textarea"
        value="Some text"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("Some text")).toBeInTheDocument();
  });

  it("should render select with options", () => {
    const options = [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
    ] as const;
    render(
      <FormField
        id="select"
        label="Choose"
        type="select"
        value="opt1"
        options={options}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should call onChange when value changes", async () => {
    const handleChange = vi.fn();
    render(
      <FormField
        id="username"
        label="Username"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "newuser");
    
    expect(handleChange).toHaveBeenCalled();
  });

  it("should display error message", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Invalid email"
      />
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("should display hint text", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        hint="Enter your email address"
      />
    );
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("should hide hint when error is present", () => {
    const { container } = render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Invalid"
        hint="Help text"
      />
    );
    expect(screen.getByText("Invalid")).toBeInTheDocument();
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("should apply error styling", () => {
    const { container } = render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Invalid email"
      />
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-destructive/60");
  });

  it("should render placeholder", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        placeholder="Enter email..."
      />
    );
    expect(screen.getByPlaceholderText("Enter email...")).toBeInTheDocument();
  });
});
