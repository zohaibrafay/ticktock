import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { timesheetService } from "./timesheet.service";
import { http } from "@/lib/http";
import { storage } from "./storage.service";
import type { Week, Entry } from "@/lib/schemas";

vi.mock("@/lib/http");
vi.mock("./storage.service");

describe("TimesheetService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockWeek: Week = {
    id: "01-w1",
    weekNo: 1,
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    status: "Incomplete",
  };

  const mockEntry: Entry = {
    id: "T01",
    wId: "01-w1",
    date: "2026-05-01",
    hrs: 8,
    description: "Work",
    project: "Alert",
    workType: "Development",
  };

  describe("fetchWeeks", () => {
    it("should fetch and return weeks", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [mockWeek] });
      
      const weeks = await timesheetService.fetchWeeks();
      
      expect(weeks).toHaveLength(1);
      expect(weeks[0]).toEqual(mockWeek);
    });

    it("should save weeks to storage", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [mockWeek] });
      
      await timesheetService.fetchWeeks();
      
      expect(storage.setWeeks).toHaveBeenCalledWith([mockWeek]);
    });

    it("should filter invalid weeks", async () => {
      vi.mocked(http.get).mockResolvedValue({
        data: [mockWeek, { invalid: "data" }],
      });
      
      const weeks = await timesheetService.fetchWeeks();
      
      expect(weeks).toHaveLength(1);
    });

    it("should handle empty response", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] });
      
      const weeks = await timesheetService.fetchWeeks();
      
      expect(weeks).toHaveLength(0);
    });
  });

  describe("createWeek", () => {
    it("should create week with Missing status", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: mockWeek });
      
      const week = await timesheetService.createWeek({
        weekNumber: 1,
        startDate: "2026-05-01",
        endDate: "2026-05-07",
      });
      
      expect(week).toEqual(mockWeek);
      expect(http.post).toHaveBeenCalledWith(
        "/timesheets",
        expect.objectContaining({ status: "Missing" })
      );
    });

    it("should clear cache after creation", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: mockWeek });
      
      await timesheetService.createWeek({
        weekNumber: 1,
        startDate: "2026-05-01",
        endDate: "2026-05-07",
      });
      
      expect(http.clearCache).toHaveBeenCalled();
    });
  });

  describe("updateWeek", () => {
    it("should update week", async () => {
      vi.mocked(http.put).mockResolvedValue({ data: mockWeek });
      
      const week = await timesheetService.updateWeek("01-w1", {
        status: "Completed",
      });
      
      expect(week).toEqual(mockWeek);
    });

    it("should clear cache after update", async () => {
      vi.mocked(http.put).mockResolvedValue({ data: mockWeek });
      
      await timesheetService.updateWeek("01-w1", { status: "Completed" });
      
      expect(http.clearCache).toHaveBeenCalled();
    });
  });

  describe("deleteWeek", () => {
    it("should delete week", async () => {
      vi.mocked(http.delete).mockResolvedValue({});
      
      await timesheetService.deleteWeek("01-w1");
      
      expect(http.delete).toHaveBeenCalledWith("/timesheets/01-w1");
    });

    it("should clear cache after deletion", async () => {
      vi.mocked(http.delete).mockResolvedValue({});
      
      await timesheetService.deleteWeek("01-w1");
      
      expect(http.clearCache).toHaveBeenCalled();
    });
  });

  describe("fetchEntries", () => {
    it("should fetch entries for week", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [mockEntry] });
      vi.mocked(storage.getEntries).mockReturnValue([]);
      
      const entries = await timesheetService.fetchEntries("01-w1");
      
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(mockEntry);
    });

    it("should merge entries with existing storage", async () => {
      const otherEntry: Entry = { ...mockEntry, id: "T02", wId: "01-w2" };
      vi.mocked(http.get).mockResolvedValue({ data: [mockEntry] });
      vi.mocked(storage.getEntries).mockReturnValue([otherEntry]);
      
      await timesheetService.fetchEntries("01-w1");
      
      expect(storage.setEntries).toHaveBeenCalledWith(
        expect.arrayContaining([mockEntry, otherEntry])
      );
    });

    it("should replace entries for same week", async () => {
      const existingEntry: Entry = { ...mockEntry, hrs: 6 };
      vi.mocked(http.get).mockResolvedValue({ data: [mockEntry] });
      vi.mocked(storage.getEntries).mockReturnValue([existingEntry]);
      
      await timesheetService.fetchEntries("01-w1");
      
      // Should have new entry, not old one
      expect(storage.setEntries).toHaveBeenCalledWith(
        expect.arrayContaining([mockEntry])
      );
    });
  });

  describe("createEntry", () => {
    it("should create entry", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: mockEntry });
      
      const entry = await timesheetService.createEntry("01-w1", {
        date: "2026-05-01",
        hours: 8,
        description: "Work",
        project: "Alert",
        workType: "Development",
      });
      
      expect(entry).toEqual(mockEntry);
    });

    it("should upsert to storage", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: mockEntry });
      
      await timesheetService.createEntry("01-w1", {
        date: "2026-05-01",
        hours: 8,
        description: "Work",
        project: "Alert",
        workType: "Development",
      });
      
      expect(storage.upsertEntry).toHaveBeenCalledWith(mockEntry);
    });

    it("should clear cache after creation", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: mockEntry });
      
      await timesheetService.createEntry("01-w1", {
        date: "2026-05-01",
        hours: 8,
        description: "Work",
        project: "Alert",
        workType: "Development",
      });
      
      expect(http.clearCache).toHaveBeenCalled();
    });
  });

  describe("updateEntry", () => {
    it("should update entry", async () => {
      vi.mocked(http.put).mockResolvedValue({ data: mockEntry });
      
      const entry = await timesheetService.updateEntry("01-w1", "T01", {
        hrs: 10,
      });
      
      expect(entry).toEqual(mockEntry);
    });

    it("should upsert to storage", async () => {
      vi.mocked(http.put).mockResolvedValue({ data: mockEntry });
      
      await timesheetService.updateEntry("01-w1", "T01", { hrs: 10 });
      
      expect(storage.upsertEntry).toHaveBeenCalledWith(mockEntry);
    });
  });

  describe("deleteEntry", () => {
    it("should delete entry", async () => {
      vi.mocked(http.delete).mockResolvedValue({});
      
      await timesheetService.deleteEntry("01-w1", "T01");
      
      expect(http.delete).toHaveBeenCalledWith("/timesheets/01-w1/entries/T01");
    });

    it("should remove from storage", async () => {
      vi.mocked(http.delete).mockResolvedValue({});
      
      await timesheetService.deleteEntry("01-w1", "T01");
      
      expect(storage.removeEntry).toHaveBeenCalledWith("T01");
    });

    it("should clear cache after deletion", async () => {
      vi.mocked(http.delete).mockResolvedValue({});
      
      await timesheetService.deleteEntry("01-w1", "T01");
      
      expect(http.clearCache).toHaveBeenCalled();
    });
  });
});
