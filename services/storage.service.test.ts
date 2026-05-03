import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { storage } from "./storage.service";
import type { Week, Entry } from "@/lib/schemas";

describe("StorageService", () => {
  const mockWeek: Week = {
    id: "01-w1",
    weekNo: 1,
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    status: "Completed",
  };

  const mockEntry: Entry = {
    id: "T01",
    wId: "01-w1",
    date: "2026-05-01",
    hrs: 8,
    description: "Test work",
    project: "Alert",
    workType: "Development",
  };

  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  describe("getWeeks", () => {
    it("should return empty array when no weeks are stored", () => {
      const weeks = storage.getWeeks();
      expect(weeks).toEqual([]);
    });

    it("should return stored weeks", () => {
      storage.setWeeks([mockWeek]);
      const weeks = storage.getWeeks();
      expect(weeks).toHaveLength(1);
      expect(weeks[0]).toEqual(mockWeek);
    });

    it("should return multiple weeks", () => {
      const week2: Week = { ...mockWeek, id: "01-w2", weekNo: 2 };
      storage.setWeeks([mockWeek, week2]);
      const weeks = storage.getWeeks();
      expect(weeks).toHaveLength(2);
    });
  });

  describe("getEntries", () => {
    it("should return empty array when no entries are stored", () => {
      const entries = storage.getEntries();
      expect(entries).toEqual([]);
    });

    it("should return all entries when no weekId provided", () => {
      storage.setEntries([mockEntry]);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(mockEntry);
    });

    it("should return entries filtered by weekId", () => {
      const entry2: Entry = { ...mockEntry, id: "T02", wId: "01-w2" };
      storage.setEntries([mockEntry, entry2]);
      const entries = storage.getEntries("01-w1");
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe("T01");
    });

    it("should return multiple entries for same week", () => {
      const entry2: Entry = { ...mockEntry, id: "T02" };
      storage.setEntries([mockEntry, entry2]);
      const entries = storage.getEntries("01-w1");
      expect(entries).toHaveLength(2);
    });
  });

  describe("setWeeks", () => {
    it("should store weeks preserving existing entries", () => {
      storage.setEntries([mockEntry]);
      storage.setWeeks([mockWeek]);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
      const weeks = storage.getWeeks();
      expect(weeks).toHaveLength(1);
    });
  });

  describe("setEntries", () => {
    it("should store entries preserving existing weeks", () => {
      storage.setWeeks([mockWeek]);
      storage.setEntries([mockEntry]);
      const weeks = storage.getWeeks();
      expect(weeks).toHaveLength(1);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
    });
  });

  describe("upsertEntry", () => {
    it("should insert new entry", () => {
      storage.upsertEntry(mockEntry);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(mockEntry);
    });

    it("should update existing entry", () => {
      storage.upsertEntry(mockEntry);
      const updated: Entry = { ...mockEntry, hrs: 10 };
      storage.upsertEntry(updated);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].hrs).toBe(10);
    });

    it("should preserve other entries when upserting", () => {
      const entry2: Entry = { ...mockEntry, id: "T02", hrs: 6 };
      storage.upsertEntry(mockEntry);
      storage.upsertEntry(entry2);
      const entries = storage.getEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].hrs).toBe(8);
      expect(entries[1].hrs).toBe(6);
    });
  });

  describe("removeEntry", () => {
    it("should remove entry by id", () => {
      storage.upsertEntry(mockEntry);
      storage.removeEntry("T01");
      const entries = storage.getEntries();
      expect(entries).toHaveLength(0);
    });

    it("should preserve other entries when removing", () => {
      const entry2: Entry = { ...mockEntry, id: "T02" };
      storage.upsertEntry(mockEntry);
      storage.upsertEntry(entry2);
      storage.removeEntry("T01");
      const entries = storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe("T02");
    });

    it("should not error when removing non-existent entry", () => {
      expect(() => storage.removeEntry("non-existent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should clear all data", () => {
      storage.setWeeks([mockWeek]);
      storage.setEntries([mockEntry]);
      storage.clear();
      expect(storage.getWeeks()).toEqual([]);
      expect(storage.getEntries()).toEqual([]);
    });
  });
});
