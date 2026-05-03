import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const defaultProps = {
    pSize: 5,
    pNumber: 1,
    totalLength: 50,
    handlePagination: vi.fn(),
  };

  it("should render pagination controls", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should render page numbers", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should disable Previous button on first page", () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should enable Previous button when not on first page", () => {
    render(<Pagination {...defaultProps} pNumber={2} />);
    const prevButton = screen.getByText("Previous");
    expect(prevButton).not.toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    render(<Pagination {...defaultProps} pNumber={10} />);
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should enable Next button when not on last page", () => {
    render(<Pagination {...defaultProps} pNumber={1} />);
    const nextButton = screen.getByText("Next");
    expect(nextButton).not.toBeDisabled();
  });

  it("should call handlePagination when Previous clicked", async () => {
    const handlePagination = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        pNumber={2}
        handlePagination={handlePagination}
      />
    );
    
    const prevButton = screen.getByText("Previous");
    await userEvent.click(prevButton);
    
    expect(handlePagination).toHaveBeenCalledWith(1, 5);
  });

  it("should call handlePagination when Next clicked", async () => {
    const handlePagination = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        pNumber={1}
        handlePagination={handlePagination}
      />
    );
    
    const nextButton = screen.getByText("Next");
    await userEvent.click(nextButton);
    
    expect(handlePagination).toHaveBeenCalledWith(2, 5);
  });

  it("should render page size selector", () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByDisplayValue("5 per page");
    expect(select).toBeInTheDocument();
  });

  it("should call handlePagination when page size changes", async () => {
    const handlePagination = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        handlePagination={handlePagination}
      />
    );
    
    const select = screen.getByDisplayValue("5 per page") as HTMLSelectElement;
    await userEvent.selectOptions(select, "10");
    
    expect(handlePagination).toHaveBeenCalledWith(1, 10);
  });

  it("should highlight current page", () => {
    render(<Pagination {...defaultProps} pNumber={1} />);
    const pageButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "1"
    );
    expect(pageButton).toHaveClass("bg-muted");
  });

  it("should calculate correct number of pages", () => {
    render(<Pagination {...defaultProps} totalLength={25} pSize={5} />);
    // Should have pages 1-5
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should show ellipsis for skipped pages", () => {
    render(
      <Pagination
        {...defaultProps}
        totalLength={100}
        pSize={5}
        pNumber={5}
      />
    );
    // With many pages, should show ellipsis
    const ellipsis = screen.getAllByText("…");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("should handle zero items", () => {
    render(<Pagination {...defaultProps} totalLength={0} />);
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });
});
