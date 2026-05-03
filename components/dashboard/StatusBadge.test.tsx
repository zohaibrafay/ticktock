import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";
import type { WeekStatus } from "@/lib/constants";

describe("StatusBadge Component", () => {
  it("should render Completed status", () => {
    render(<StatusBadge status="Completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("should render Incomplete status", () => {
    render(<StatusBadge status="Incomplete" />);
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  it("should render Missing status", () => {
    render(<StatusBadge status="Missing" />);
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("should render Overtime status", () => {
    render(<StatusBadge status="Overtime" />);
    expect(screen.getByText("Overtime")).toBeInTheDocument();
  });

  it("should apply appropriate styling for Completed", () => {
    const { container } = render(<StatusBadge status="Completed" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("bg-emerald-50");
    expect(badge).toHaveClass("text-emerald-700");
  });

  it("should apply appropriate styling for Incomplete", () => {
    const { container } = render(<StatusBadge status="Incomplete" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("bg-amber-50");
    expect(badge).toHaveClass("text-amber-700");
  });

  it("should apply appropriate styling for Missing", () => {
    const { container } = render(<StatusBadge status="Missing" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("bg-slate-100");
    expect(badge).toHaveClass("text-slate-500");
  });

  it("should apply appropriate styling for Overtime", () => {
    const { container } = render(<StatusBadge status="Overtime" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("bg-orange-50");
    expect(badge).toHaveClass("text-orange-700");
  });
});
