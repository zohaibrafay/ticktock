export type ErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "SERVER_ERROR"
  | "UNKNOWN";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly context: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, statusCode = 500, context: Record<string, unknown> = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ApiError extends AppError {
  constructor(status: number, message: string, context?: Record<string, unknown>) {
    const code: ErrorCode =
      status === 404 ? "NOT_FOUND" :
      status === 401 ? "UNAUTHORIZED" :
      status === 400 ? "VALIDATION_ERROR" :
      "SERVER_ERROR";
    super(code, message, status, context);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends AppError {
  readonly errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string>, context?: Record<string, unknown>) {
    super("VALIDATION_ERROR", message, 400, context);
    this.errors = errors;
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super("NETWORK_ERROR", message, 0, context);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

// ─── Type Guards ────────────────────────────────────
export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
export const isValidationError = (e: unknown): e is ValidationError => e instanceof ValidationError;
export const isNetworkError = (e: unknown): e is NetworkError => e instanceof NetworkError;

export function normalizeError(err: unknown): AppError {
  if (isAppError(err)) return err;
  if (err instanceof Error) return new AppError("UNKNOWN", err.message, 500, { stack: err.stack });
  return new AppError("UNKNOWN", String(err));
}
