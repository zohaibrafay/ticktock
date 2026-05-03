import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDelete from "./ConfirmDelete";

describe("ConfirmDelete Component", () => {
  const defaultProps = {
    open: true,
    title: "Delete Entry",
    message: "This action cannot be undone",
    loading: false,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("should not render when open is false", () => {
    render(<ConfirmDelete {...defaultProps} open={false} />);
    expect(screen.queryByText("Delete Entry")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    render(<ConfirmDelete {...defaultProps} />);
    expect(screen.getByText("Delete Entry")).toBeInTheDocument();
  });

  it("should display title and message", () => {
    render(<ConfirmDelete {...defaultProps} />);
    expect(screen.getByText("Delete Entry")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone")).toBeInTheDocument();
  });

  it("should render Delete and Cancel buttons", () => {
    render(<ConfirmDelete {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should call onConfirm when Delete button clicked", async () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmDelete {...defaultProps} onConfirm={handleConfirm} />
    );
    
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);
    
    expect(handleConfirm).toHaveBeenCalled();
  });

  it("should call onCancel when Cancel button clicked", async () => {
    const handleCancel = vi.fn();
    render(
      <ConfirmDelete {...defaultProps} onCancel={handleCancel} />
    );
    
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalled();
  });

  it("should disable Delete button when loading", () => {
    render(<ConfirmDelete {...defaultProps} loading={true} />);
    const deleteButton = screen.getByRole("button", { name: "Deleting..." });
    expect(deleteButton).toBeDisabled();
  });

  it("should show Deleting text when loading", () => {
    render(<ConfirmDelete {...defaultProps} loading={true} />);
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("should show Delete text when not loading", () => {
    render(<ConfirmDelete {...defaultProps} loading={false} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should have modal styles applied", () => {
    const { container } = render(<ConfirmDelete {...defaultProps} />);
    const modal = container.querySelector(".fixed.inset-0");
    expect(modal).toBeInTheDocument();
  });
});
