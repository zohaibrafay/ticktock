import { describe, it, expect } from "vitest";
import {
  getTotalHours,
  getOvertime,
  getProgress,
  deriveStatus,
  syncStatuses,
  actionLabel,
  compareWeeks,
} from "./week-status.service";
import { TIMESHEET } from "@/lib/constants";
import type { Week, Entry } from "@/lib/schemas";

describe("week-status.service", () => {
  const mockEntries: Entry[] = [
    { id: "T01", wId: "01-w1", date: "2026-05-01", hrs: 8, description: "Work", project: "Alert", workType: "Dev" },
    { id: "T02", wId: "01-w1", date: "2026-05-02", hrs: 8, description: "Work", project: "Alert", workType: "Dev" },
    { id: "T03", wId: "01-w1", date: "2026-05-03", hrs: 8, description: "Work", project: "Alert", workType: "Dev" },
    { id: "T04", wId: "01-w1", date: "2026-05-04", hrs: 8, description: "Work", project: "Alert", workType: "Dev" },
    { id: "T05", wId: "01-w1", date: "2026-05-05", hrs: 8, description: "Work", project: "Alert", workType: "Dev" },
    { id: "T06", wId: "01-w2", date: "2026-05-08", hrs: 4, description: "Work", project: "Alert", workType: "Dev" },
  ];

  const mockWeeks: Week[] = [
    { id: "01-w1", weekNo: 1, startDate: "2026-05-01", endDate: "2026-05-07", status: "Incomplete" },
    { id: "01-w2", weekNo: 2, startDate: "2026-05-08", endDate: "2026-05-14", status: "Incomplete" },
  ];

  describe("getTotalHours", () => {
    it("should sum hours for specific week", () => {
      const total = getTotalHours(mockEntries, "01-w1");
      expect(total).toBe(40);
    });

    it("should return 0 for week with no entries", () => {
      const total = getTotalHours(mockEntries, "non-existent");
      expect(total).toBe(0);
    });

    it("should handle single entry", () => {
      const entries = [
        { id: "T01", wId: "01-w1", date: "2026-05-01", hrs: 5, description: "Work", project: "Alert", workType: "Dev" },
      ];
      const total = getTotalHours(entries, "01-w1");
      expect(total).toBe(5);
    });

    it("should correctly sum different hour amounts", () => {
      const entries = [
        { id: "T01", wId: "01-w1", date: "2026-05-01", hrs: 2, description: "Work", project: "Alert", workType: "Dev" },
        { id: "T02", wId: "01-w1", date: "2026-05-02", hrs: 3, description: "Work", project: "Alert", workType: "Dev" },
        { id: "T03", wId: "01-w1", date: "2026-05-03", hrs: 5, description: "Work", project: "Alert", workType: "Dev" },
      ];
      const total = getTotalHours(entries, "01-w1");
      expect(total).toBe(10);
    });
  });

  describe("getOvertime", () => {
    it("should return 0 for hours under target", () => {
      const overtime = getOvertime(30);
      expect(overtime).toBe(0);
    });

    it("should return 0 for exact target hours", () => {
      const overtime = getOvertime(TIMESHEET.TARGET_HOURS);
      expect(overtime).toBe(0);
    });

    it("should return positive for hours over target", () => {
      const overtime = getOvertime(45);
      expect(overtime).toBe(5);
    });

    it("should handle large overtime", () => {
      const overtime = getOvertime(60);
      expect(overtime).toBe(20);
    });
  });

  describe("getProgress", () => {
    it("should return 0 for zero hours", () => {
      const progress = getProgress(0);
      expect(progress).toBe(0);
    });

    it("should return 100 for target hours", () => {
      const progress = getProgress(TIMESHEET.TARGET_HOURS);
      expect(progress).toBe(100);
    });

    it("should return percentage for partial hours", () => {
      const progress = getProgress(20); // 20/40 = 50%
      expect(progress).toBe(50);
    });

    it("should cap at 100 for overtime", () => {
      const progress = getProgress(50);
      expect(progress).toBe(100);
    });

    it("should calculate 75% correctly", () => {
      const progress = getProgress(30); // 30/40 = 75%
      expect(progress).toBe(75);
    });
  });

  describe("deriveStatus", () => {
    it("should return Missing for 0 hours", () => {
      const status = deriveStatus(0);
      expect(status).toBe(TIMESHEET.STATUS.MISSING);
    });

    it("should return Incomplete for partial hours", () => {
      const status = deriveStatus(30);
      expect(status).toBe(TIMESHEET.STATUS.INCOMPLETE);
    });

    it("should return Completed for target hours", () => {
      const status = deriveStatus(40);
      expect(status).toBe(TIMESHEET.STATUS.COMPLETED);
    });

    it("should return Overtime for hours over target", () => {
      const status = deriveStatus(45);
      expect(status).toBe(TIMESHEET.STATUS.OVERTIME);
    });

    it("should handle boundary at target", () => {
      const status = deriveStatus(TIMESHEET.TARGET_HOURS);
      expect(status).toBe(TIMESHEET.STATUS.COMPLETED);
    });
  });

  describe("syncStatuses", () => {
    it("should update week statuses based on entries", () => {
      const synced = syncStatuses(mockWeeks, mockEntries);
      expect(synced[0].status).toBe(TIMESHEET.STATUS.COMPLETED);
      expect(synced[1].status).toBe(TIMESHEET.STATUS.INCOMPLETE);
    });

    it("should preserve week data except status", () => {
      const synced = syncStatuses(mockWeeks, mockEntries);
      expect(synced[0].id).toBe("01-w1");
      expect(synced[0].weekNo).toBe(1);
      expect(synced[0].startDate).toBe("2026-05-01");
    });

    it("should mark week as Missing if no entries", () => {
      const weeks = [{ id: "01-w1", weekNo: 1, startDate: "2026-05-01", endDate: "2026-05-07", status: "Incomplete" as const }];
      const synced = syncStatuses(weeks, []);
      expect(synced[0].status).toBe(TIMESHEET.STATUS.MISSING);
    });
  });

  describe("actionLabel", () => {
    it("should return View for Completed", () => {
      const label = actionLabel("Completed");
      expect(label).toBe("View");
    });

    it("should return Create for Missing", () => {
      const label = actionLabel("Missing");
      expect(label).toBe("Create");
    });

    it("should return Update for Incomplete", () => {
      const label = actionLabel("Incomplete");
      expect(label).toBe("Update");
    });

    it("should return Update for Overtime", () => {
      const label = actionLabel("Overtime");
      expect(label).toBe("Update");
    });
  });

  describe("compareWeeks", () => {
    it("should sort by weekNumber ascending", () => {
      const result = compareWeeks(
        { ...mockWeeks[1] },
        { ...mockWeeks[0] },
        "weekNumber",
        "asc"
      );
      expect(result).toBeGreaterThan(0);
    });

    it("should sort by weekNumber descending", () => {
      const result = compareWeeks(
        { ...mockWeeks[0] },
        { ...mockWeeks[1] },
        "weekNumber",
        "desc"
      );
      expect(result).toBeGreaterThan(0);
    });

    it("should sort by date ascending", () => {
      const week1 = { ...mockWeeks[0] };
      const week2 = { ...mockWeeks[1] };
      const result = compareWeeks(week1, week2, "date", "asc");
      expect(result).toBeLessThan(0);
    });

    it("should sort by status ascending", () => {
      const week1 = { ...mockWeeks[0], status: "Completed" as const };
      const week2 = { ...mockWeeks[1], status: "Missing" as const };
      const result = compareWeeks(week1, week2, "status", "asc");
      expect(result).toBeLessThan(0);
    });

    it("should return 0 for equal values", () => {
      const result = compareWeeks(mockWeeks[0], mockWeeks[0], "weekNumber", "asc");
      expect(result).toBe(0);
    });
  });
});
