import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntryCard from "./EntryCard";
import type { Entry } from "@/lib/schemas";

describe("EntryCard Component", () => {
  const mockEntry: Entry = {
    id: "T01",
    wId: "01-w1",
    date: "2026-05-01",
    hrs: 8,
    description: "Frontend development",
    project: "Ticktock",
    workType: "Development",
  };

  const defaultProps = {
    entry: mockEntry,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("should render entry description", () => {
    render(<EntryCard {...defaultProps} />);
    expect(screen.getByText("Frontend development")).toBeInTheDocument();
  });

  it("should render work type", () => {
    render(<EntryCard {...defaultProps} />);
    expect(screen.getByText("Development")).toBeInTheDocument();
  });

  it("should render hours", () => {
    render(<EntryCard {...defaultProps} />);
    expect(screen.getByText("8 hrs")).toBeInTheDocument();
  });

  it("should render project badge", () => {
    render(<EntryCard {...defaultProps} />);
    expect(screen.getByText("Ticktock")).toBeInTheDocument();
  });

  it("should show actions menu on button click", async () => {
    render(<EntryCard {...defaultProps} />);
    const menuButton = screen.getByRole("button", { hidden: true });
    await userEvent.click(menuButton);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should call onEdit when Edit clicked", async () => {
    const handleEdit = vi.fn();
    render(
      <EntryCard {...defaultProps} onEdit={handleEdit} />
    );
    
    const menuButton = screen.getByRole("button", { hidden: true });
    await userEvent.click(menuButton);
    
    const editButton = screen.getByText("Edit");
    await userEvent.click(editButton);
    
    expect(handleEdit).toHaveBeenCalledWith(mockEntry);
  });

  it("should call onDelete when Delete clicked", async () => {
    const handleDelete = vi.fn();
    render(
      <EntryCard {...defaultProps} onDelete={handleDelete} />
    );
    
    const menuButton = screen.getByRole("button", { hidden: true });
    await userEvent.click(menuButton);
    
    const deleteButton = screen.getByText("Delete");
    await userEvent.click(deleteButton);
    
    expect(handleDelete).toHaveBeenCalledWith("T01");
  });

  it("should close menu after action", async () => {
    const handleEdit = vi.fn();
    render(
      <EntryCard {...defaultProps} onEdit={handleEdit} />
    );
    
    const menuButton = screen.getByRole("button", { hidden: true });
    await userEvent.click(menuButton);
    
    const editButton = screen.getByText("Edit");
    await userEvent.click(editButton);
    
    // Menu should be closed, so Delete should not be visible
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("should handle different project types", () => {
    const entryInternal = { ...mockEntry, project: "Internal" };
    render(<EntryCard entry={entryInternal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Internal")).toBeInTheDocument();
  });

  it("should handle different hours", () => {
    const entryShort = { ...mockEntry, hrs: 2 };
    render(<EntryCard entry={entryShort} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("2 hrs")).toBeInTheDocument();
  });
});
