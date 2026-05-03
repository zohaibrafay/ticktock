import { describe, it, expect } from "vitest";
import {
  weekSchema,
  entrySchema,
  loginSchema,
  extractErrors,
} from "./schemas";

describe("Schemas", () => {
  describe("weekSchema", () => {
    it("should validate a valid week", () => {
      const validWeek = {
        id: "01-w1",
        weekNo: 1,
        startDate: "2026-05-01",
        endDate: "2026-05-07",
        status: "Completed" as const,
      };
      const result = weekSchema.safeParse(validWeek);
      expect(result.success).toBe(true);
    });

    it("should reject invalid status", () => {
      const invalidWeek = {
        id: "01-w1",
        weekNo: 1,
        startDate: "2026-05-01",
        endDate: "2026-05-07",
        status: "Invalid",
      };
      const result = weekSchema.safeParse(invalidWeek);
      expect(result.success).toBe(false);
    });

    it("should reject missing id", () => {
      const invalidWeek = {
        weekNo: 1,
        startDate: "2026-05-01",
        endDate: "2026-05-07",
        status: "Completed" as const,
      };
      const result = weekSchema.safeParse(invalidWeek);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date format", () => {
      const invalidWeek = {
        id: "01-w1",
        weekNo: 1,
        startDate: "05/01/2026",
        endDate: "2026-05-07",
        status: "Completed" as const,
      };
      const result = weekSchema.safeParse(invalidWeek);
      expect(result.success).toBe(false);
    });

    it("should accept all valid statuses", () => {
      const statuses = ["Completed", "Incomplete", "Missing", "Overtime"];
      statuses.forEach((status) => {
        const week = {
          id: "01-w1",
          weekNo: 1,
          startDate: "2026-05-01",
          endDate: "2026-05-07",
          status,
        };
        const result = weekSchema.safeParse(week);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("entrySchema", () => {
    it("should validate a valid entry", () => {
      const validEntry = {
        id: "T01",
        wId: "01-w1",
        date: "2026-05-01",
        hrs: 8,
        description: "Work description",
        project: "Alert",
        workType: "Development",
      };
      const result = entrySchema.safeParse(validEntry);
      expect(result.success).toBe(true);
    });

    it("should reject negative hours", () => {
      const invalidEntry = {
        id: "T01",
        wId: "01-w1",
        date: "2026-05-01",
        hrs: -5,
        description: "Work description",
        project: "Alert",
        workType: "Development",
      };
      const result = entrySchema.safeParse(invalidEntry);
      expect(result.success).toBe(false);
    });

    it("should accept zero hours", () => {
      const validEntry = {
        id: "T01",
        wId: "01-w1",
        date: "2026-05-01",
        hrs: 0,
        description: "Work description",
        project: "Alert",
        workType: "Development",
      };
      const result = entrySchema.safeParse(validEntry);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const invalidEntry = {
        id: "T01",
        wId: "01-w1",
        date: "2026-05-01",
      };
      const result = entrySchema.safeParse(invalidEntry);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should validate a valid login", () => {
      const validLogin = {
        email: "test@example.com",
        password: "password123",
      };
      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidLogin = {
        email: "not-an-email",
        password: "password123",
      };
      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const invalidLogin = {
        email: "test@example.com",
        password: "123",
      };
      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it("should accept rememberMe flag", () => {
      const validLogin = {
        email: "test@example.com",
        password: "password123",
        rememberMe: true,
      };
      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });
  });

  describe("extractErrors", () => {
    it("should extract single error", () => {
      const validLogin = { email: "invalid" };
      const result = loginSchema.safeParse(validLogin);
      if (!result.success) {
        const errors = extractErrors(result.error);
        expect(errors).toHaveProperty("email");
      }
    });

    it("should extract multiple errors", () => {
      const invalidLogin = { email: "invalid" };
      const result = loginSchema.safeParse(invalidLogin);
      if (!result.success) {
        const errors = extractErrors(result.error);
        expect(Object.keys(errors).length).toBeGreaterThan(0);
      }
    });

    it("should use path as key", () => {
      const invalidLogin = { email: "invalid" };
      const result = loginSchema.safeParse(invalidLogin);
      if (!result.success) {
        const errors = extractErrors(result.error);
        expect(Object.keys(errors)[0]).toBe("email");
      }
    });
  });
});
