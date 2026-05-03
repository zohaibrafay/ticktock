import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressHeader from "./ProgressHeader";
import type { Week } from "@/lib/schemas";

describe("ProgressHeader Component", () => {
  const mockWeek: Week = {
    id: "01-w1",
    weekNo: 1,
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    status: "Incomplete",
  };

  it("should render week number", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    expect(screen.getByText(/Week 1 Timesheet/)).toBeInTheDocument();
  });

  it("should render week date range", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    expect(screen.getByText(/1 - 7 May 2026/)).toBeInTheDocument();
  });

  it("should render total hours", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("/40 hrs")).toBeInTheDocument();
  });

  it("should render progress percentage", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("should show overtime badge when overtime hours present", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={42}
        overtimeHours={2}
        progress={105}
      />
    );
    expect(screen.getByText("+2 hrs overtime")).toBeInTheDocument();
  });

  it("should not show overtime badge when no overtime", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    expect(screen.queryByText(/overtime/)).not.toBeInTheDocument();
  });

  it("should have progress bar element", () => {
    const { container } = render(
      <ProgressHeader
        week={mockWeek}
        totalHours={32}
        overtimeHours={0}
        progress={80}
      />
    );
    const progressBar = container.querySelector(".h-2\\.5");
    expect(progressBar).toBeInTheDocument();
  });

  it("should show completed status styling at 100%", () => {
    const { container } = render(
      <ProgressHeader
        week={mockWeek}
        totalHours={40}
        overtimeHours={0}
        progress={100}
      />
    );
    const progressFill = container.querySelector(
      ".bg-gradient-to-r"
    );
    expect(progressFill).toBeInTheDocument();
  });

  it("should handle zero hours", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={0}
        overtimeHours={0}
        progress={0}
      />
    );
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should handle over 100% progress", () => {
    render(
      <ProgressHeader
        week={mockWeek}
        totalHours={50}
        overtimeHours={10}
        progress={125}
      />
    );
    expect(screen.getByText(/overtime/)).toBeInTheDocument();
  });
});
