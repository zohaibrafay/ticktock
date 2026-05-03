/**
 * Server-side API response helpers.
 * Used exclusively in route handlers — keeps responses consistent.
 */

import { NextResponse } from "next/server";
import { AppError, ValidationError } from "./errors";

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    errors?: Record<string, string>;
  };
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data, timestamp: new Date().toISOString() } satisfies SuccessEnvelope<T>,
    { status },
  );
}

export function fail(err: Error | AppError, status = 500) {
  let code = "SERVER_ERROR";
  let message = err.message;
  let fieldErrors: Record<string, string> | undefined;

  if (err instanceof ValidationError) {
    code = "VALIDATION_ERROR";
    status = 400;
    fieldErrors = err.errors;
  } else if (err instanceof AppError) {
    code = err.code;
    status = err.statusCode;
  }

  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(fieldErrors && { errors: fieldErrors }) },
    } satisfies ErrorEnvelope,
    { status },
  );
}

export function notFound(msg = "Resource not found") {
  return fail(new AppError("NOT_FOUND", msg, 404), 404);
}
