import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatWeekRange,
  formatShortDate,
  formatDayName,
  getParseDate,
  getDatesInRange,
  resolveDateRange,
  cn,
} from "./utils";

describe("utils", () => {
  describe("getParseDate", () => {
    it("should parse YYYY-MM-DD format correctly", () => {
      const date = getParseDate("2026-05-03");
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(4); // May is 4 (0-indexed)
      expect(date.getDate()).toBe(3);
    });

    it("should handle January correctly", () => {
      const date = getParseDate("2026-01-15");
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it("should handle December correctly", () => {
      const date = getParseDate("2026-12-25");
      expect(date.getMonth()).toBe(11);
      expect(date.getDate()).toBe(25);
    });
  });

  describe("formatWeekRange", () => {
    it("should format dates in the same month and year", () => {
      const result = formatWeekRange("2026-05-01", "2026-05-07");
      expect(result).toBe("1 - 7 May 2026");
    });

    it("should format dates across different months in same year", () => {
      const result = formatWeekRange("2026-04-28", "2026-05-04");
      expect(result).toBe("28 April - 4 May 2026");
    });

    it("should format dates across different years", () => {
      const result = formatWeekRange("2025-12-29", "2026-01-04");
      expect(result).toBe("29 December 2025 - 4 January 2026");
    });
  });

  describe("formatShortDate", () => {
    it("should format date as D MMM", () => {
      const result = formatShortDate("2026-05-03");
      expect(result).toMatch(/3 May/);
    });

    it("should handle first day of month", () => {
      const result = formatShortDate("2026-01-01");
      expect(result).toMatch(/1 Jan/);
    });
  });

  describe("formatDayName", () => {
    it("should return full weekday name", () => {
      const result = formatDayName("2026-05-03"); // Sunday
      expect(result).toBe("Sunday");
    });

    it("should handle Monday", () => {
      const result = formatDayName("2026-04-27"); // Monday
      expect(result).toBe("Monday");
    });

    it("should handle Friday", () => {
      const result = formatDayName("2026-05-01"); // Friday
      expect(result).toBe("Friday");
    });
  });

  describe("getDatesInRange", () => {
    it("should return all dates in range inclusive", () => {
      const result = getDatesInRange("2026-05-01", "2026-05-05");
      expect(result).toHaveLength(5);
      expect(result[0]).toBe("2026-05-01");
      expect(result[4]).toBe("2026-05-05");
    });

    it("should handle single day range", () => {
      const result = getDatesInRange("2026-05-03", "2026-05-03");
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("2026-05-03");
    });

    it("should handle dates across month boundary", () => {
      const result = getDatesInRange("2026-04-29", "2026-05-02");
      expect(result).toHaveLength(4);
      expect(result[0]).toBe("2026-04-29");
      expect(result[3]).toBe("2026-05-02");
    });
  });

  describe("resolveDateRange", () => {
    beforeEach(() => {
      // Mock current date to May 3, 2026 (Saturday)
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-05-03"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should resolve this_week correctly", () => {
      const result = resolveDateRange("this_week");
      expect(result).not.toBeNull();
      // Week should start on Monday (April 27)
      expect(result?.from.getDate()).toBe(27);
      expect(result?.from.getMonth()).toBe(3); // April
      expect(result?.to.getDate()).toBe(3);
      expect(result?.to.getMonth()).toBe(4); // May
    });

    it("should resolve last_week correctly", () => {
      const result = resolveDateRange("last_week");
      expect(result).not.toBeNull();
      expect(result?.from.getDate()).toBe(20);
      expect(result?.from.getMonth()).toBe(3); // April
      expect(result?.to.getDate()).toBe(26);
      expect(result?.to.getMonth()).toBe(3); // April
    });

    it("should resolve this_month correctly", () => {
      const result = resolveDateRange("this_month");
      expect(result).not.toBeNull();
      expect(result?.from.getDate()).toBe(1);
      expect(result?.from.getMonth()).toBe(4); // May
      expect(result?.to.getMonth()).toBe(4); // May
    });

    it("should return null for unknown key", () => {
      const result = resolveDateRange("invalid_key");
      expect(result).toBeNull();
    });
  });

  describe("cn", () => {
    it("should merge tailwind classes correctly", () => {
      const result = cn("px-2 py-1", "px-3");
      expect(result).toContain("py-1");
      expect(result).toContain("px-3");
      // px-3 should override px-2
      expect(result).not.toContain("px-2");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should handle false conditions", () => {
      const result = cn("base-class", false && "should-not-appear");
      expect(result).toBe("base-class");
    });
  });
});
