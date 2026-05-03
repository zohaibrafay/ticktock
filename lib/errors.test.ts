import { describe, it, expect } from "vitest";
import {
  AppError,
  ApiError,
  ValidationError,
  NetworkError,
  isAppError,
  isApiError,
  isValidationError,
  isNetworkError,
  normalizeError,
} from "./errors";

describe("Error Classes", () => {
  describe("AppError", () => {
    it("should create error with code", () => {
      const error = new AppError("UNKNOWN", "Something went wrong");
      expect(error.code).toBe("UNKNOWN");
      expect(error.message).toBe("Something went wrong");
    });

    it("should have default status code", () => {
      const error = new AppError("UNKNOWN", "Error");
      expect(error.statusCode).toBe(500);
    });

    it("should set custom status code", () => {
      const error = new AppError("UNKNOWN", "Error", 400);
      expect(error.statusCode).toBe(400);
    });

    it("should store context", () => {
      const context = { userId: "123" };
      const error = new AppError("UNKNOWN", "Error", 500, context);
      expect(error.context).toEqual(context);
    });
  });

  describe("ApiError", () => {
    it("should map 404 to NOT_FOUND", () => {
      const error = new ApiError(404, "Not found");
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should map 401 to UNAUTHORIZED", () => {
      const error = new ApiError(401, "Unauthorized");
      expect(error.code).toBe("UNAUTHORIZED");
    });

    it("should map 400 to VALIDATION_ERROR", () => {
      const error = new ApiError(400, "Bad request");
      expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("should map other status to SERVER_ERROR", () => {
      const error = new ApiError(500, "Server error");
      expect(error.code).toBe("SERVER_ERROR");
    });

    it("should preserve status code", () => {
      const error = new ApiError(404, "Not found");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("ValidationError", () => {
    it("should store validation errors", () => {
      const errors = { email: "Invalid email", password: "Too short" };
      const error = new ValidationError("Validation failed", errors);
      expect(error.errors).toEqual(errors);
    });

    it("should have VALIDATION_ERROR code", () => {
      const error = new ValidationError("Validation failed", {});
      expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("should have 400 status code", () => {
      const error = new ValidationError("Validation failed", {});
      expect(error.statusCode).toBe(400);
    });
  });

  describe("NetworkError", () => {
    it("should have NETWORK_ERROR code", () => {
      const error = new NetworkError("Connection failed");
      expect(error.code).toBe("NETWORK_ERROR");
    });

    it("should have 0 status code", () => {
      const error = new NetworkError("Connection failed");
      expect(error.statusCode).toBe(0);
    });
  });

  describe("Type Guards", () => {
    it("isAppError should return true for AppError", () => {
      const error = new AppError("UNKNOWN", "Error");
      expect(isAppError(error)).toBe(true);
    });

    it("isAppError should return false for non-AppError", () => {
      expect(isAppError(new Error("Regular error"))).toBe(false);
      expect(isAppError("not an error")).toBe(false);
    });

    it("isApiError should return true for ApiError", () => {
      const error = new ApiError(404, "Not found");
      expect(isApiError(error)).toBe(true);
    });

    it("isValidationError should return true for ValidationError", () => {
      const error = new ValidationError("Validation failed", {});
      expect(isValidationError(error)).toBe(true);
    });

    it("isNetworkError should return true for NetworkError", () => {
      const error = new NetworkError("Connection failed");
      expect(isNetworkError(error)).toBe(true);
    });

    it("isAppError should return true for subclasses", () => {
      const apiError = new ApiError(404, "Not found");
      expect(isAppError(apiError)).toBe(true);
    });
  });

  describe("normalizeError", () => {
    it("should return AppError as-is", () => {
      const error = new AppError("UNKNOWN", "Error");
      const normalized = normalizeError(error);
      expect(normalized).toBe(error);
    });

    it("should convert Error to AppError", () => {
      const error = new Error("Something broke");
      const normalized = normalizeError(error);
      expect(isAppError(normalized)).toBe(true);
      expect(normalized.message).toBe("Something broke");
    });

    it("should handle string errors", () => {
      const normalized = normalizeError("String error");
      expect(isAppError(normalized)).toBe(true);
      expect(normalized.message).toBe("String error");
    });

    it("should handle null/undefined", () => {
      const normalizedNull = normalizeError(null);
      const normalizedUndef = normalizeError(undefined);
      expect(isAppError(normalizedNull)).toBe(true);
      expect(isAppError(normalizedUndef)).toBe(true);
    });

    it("should preserve stack trace", () => {
      const error = new Error("Original error");
      const normalized = normalizeError(error);
      expect(normalized.context.stack).toBeDefined();
    });
  });

  describe("Error name property", () => {
    it("AppError should have correct name", () => {
      const error = new AppError("UNKNOWN", "Error");
      expect(error.name).toBe("AppError");
    });

    it("ApiError should have correct name", () => {
      const error = new ApiError(404, "Not found");
      expect(error.name).toBe("ApiError");
    });

    it("ValidationError should have correct name", () => {
      const error = new ValidationError("Validation failed", {});
      expect(error.name).toBe("ValidationError");
    });

    it("NetworkError should have correct name", () => {
      const error = new NetworkError("Connection failed");
      expect(error.name).toBe("NetworkError");
    });
  });
});
