import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";

interface TestOption {
  label: string;
  value: string;
}

describe("Dropdown Component", () => {
  const defaultProps = {
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ] as TestOption[],
    value: null as TestOption | null,
    onChange: vi.fn(),
    getLabel: (o: TestOption) => o.label,
    getValue: (o: TestOption) => o.value,
    placeholder: "Select an option",
  };

  it("should render with placeholder", () => {
    render(<Dropdown {...defaultProps} />);
    const select = screen.getByDisplayValue("Select an option");
    expect(select).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(<Dropdown {...defaultProps} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("should call onChange when option is selected", async () => {
    const handleChange = vi.fn();
    render(
      <Dropdown {...defaultProps} onChange={handleChange} />
    );
    
    const select = screen.getByDisplayValue("Select an option");
    await userEvent.selectOptions(select, "opt1");
    
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "opt1" })
    );
  });

  it("should display selected value", () => {
    const selectedOption = { label: "Option 1", value: "opt1" };
    render(
      <Dropdown {...defaultProps} value={selectedOption} />
    );
    
    const select = screen.getByDisplayValue("Option 1");
    expect(select).toBeInTheDocument();
  });

  it("should accept custom placeholder", () => {
    render(
      <Dropdown {...defaultProps} placeholder="Choose item" />
    );
    const select = screen.getByDisplayValue("Choose item");
    expect(select).toBeInTheDocument();
  });

  it("should handle empty value", () => {
    render(<Dropdown {...defaultProps} value={null} />);
    const select = screen.getByDisplayValue("Select an option");
    expect(select).toHaveValue("");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Dropdown
        {...defaultProps}
        className="custom-select"
      />
    );
    const select = container.querySelector("select.custom-select");
    expect(select).toBeInTheDocument();
  });

  it("should handle clearing selection via placeholder", async () => {
    const handleChange = vi.fn();
    const selectedOption = { label: "Option 1", value: "opt1" };
    render(
      <Dropdown
        {...defaultProps}
        value={selectedOption}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByDisplayValue("Option 1") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "" } });
    
    expect(handleChange).toHaveBeenCalled();
  });
});
