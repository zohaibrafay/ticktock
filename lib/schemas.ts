/**
 * Zod schemas — THE single source of truth for all data shapes.
 * Types are inferred, never manually duplicated.
 */

import { z } from "zod";
import { TIMESHEET } from "./constants";

// ─── Auth ───────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ─── Week ───────────────────────────────────────────
export const weekSchema = z.object({
  id: z.string().min(1),
  weekNo: z.number().int().positive(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  status: z.enum([
    TIMESHEET.STATUS.MISSING,
    TIMESHEET.STATUS.INCOMPLETE,
    TIMESHEET.STATUS.COMPLETED,
    TIMESHEET.STATUS.OVERTIME,
  ]),
});
export type Week = z.infer<typeof weekSchema>;

export const createWeekSchema = weekSchema.omit({ id: true });
export type CreateWeekInput = z.infer<typeof createWeekSchema>;


export const entrySchema = z.object({
  id: z.string().min(1),
  wId: z.string().min(1),
  date: z.string().date(),
  hrs: z.number().nonnegative(),
  description: z.string(),
  project: z.string(),
  workType: z.string(),
});
export type Entry = z.infer<typeof entrySchema>;

export const entryFormSchema = z.object({
  project: z.string().min(1, "Project is required").max(TIMESHEET.PROJECT_MAX),
  workType: z.string().min(1, "Type of work is required").max(TIMESHEET.WORK_TYPE_MAX),
  description: z
    .string()
    .min(TIMESHEET.DESCRIPTION_MIN, `At least ${TIMESHEET.DESCRIPTION_MIN} characters`)
    .max(TIMESHEET.DESCRIPTION_MAX),
  hrs: z
    .number()
    .min(TIMESHEET.MIN_HOURS_PER_ENTRY, `Min ${TIMESHEET.MIN_HOURS_PER_ENTRY} hrs`)
    .max(TIMESHEET.MAX_HOURS_PER_ENTRY, `Max ${TIMESHEET.MAX_HOURS_PER_ENTRY} hrs`),
});
export type EntryFormInput = z.infer<typeof entryFormSchema>;

export const apiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string(),
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    errors: z.record(z.string(), z.string()).optional(),
  }),
});

export function extractErrors(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    map[issue.path.join(".")] = issue.message;
  }
  return map;
}
