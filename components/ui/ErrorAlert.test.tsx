import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorAlert from "./ErrorAlert";

describe("ErrorAlert Component", () => {
  it("should render error message", () => {
    render(<ErrorAlert message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render alert icon", () => {
    const { container } = render(<ErrorAlert message="Error" />);
    expect(container.querySelector(".lucide-alert-circle")).toBeInTheDocument();
  });

  it("should render Retry button when onRetry provided", () => {
    render(<ErrorAlert message="Error" onRetry={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should not render Retry button when onRetry not provided", () => {
    render(<ErrorAlert message="Error" />);
    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
  });

  it("should call onRetry when Retry button clicked", async () => {
    const handleRetry = vi.fn();
    render(<ErrorAlert message="Error" onRetry={handleRetry} />);
    
    const retryButton = screen.getByRole("button");
    await userEvent.click(retryButton);
    
    expect(handleRetry).toHaveBeenCalled();
  });

  it("should have alert styling applied", () => {
    const { container } = render(<ErrorAlert message="Error" />);
    const alert = container.querySelector(".rounded-lg");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("bg-destructive/5");
  });

  it("should have animation classes", () => {
    const { container } = render(<ErrorAlert message="Error" />);
    const alert = container.firstChild;
    expect(alert).toHaveClass("animate-in");
  });

  it("should handle long error messages", () => {
    const longMessage = "This is a very long error message that should still be displayed properly in the alert component";
    render(<ErrorAlert message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it("should handle special characters in message", () => {
    const message = "Error: <script> & \"quotes\" 'apostrophes'";
    render(<ErrorAlert message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
