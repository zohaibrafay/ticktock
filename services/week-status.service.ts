/**
 * Week status business logic — pure functions, easily testable.
 */

import { TIMESHEET, type WeekStatus } from "@/lib/constants";
import type { Week, Entry } from "@/lib/schemas";

export function getTotalHours(entries: Entry[], weekId: string): number {
  return entries.filter((e) => e.wId === weekId).reduce((s, e) => s + Number(e.hrs), 0);
}

export function getOvertime(total: number): number {
  return Math.max(0, total - TIMESHEET.TARGET_HOURS);
}

export function getProgress(total: number): number {
  return Math.min((total / TIMESHEET.TARGET_HOURS) * 100, 100);
}

export function deriveStatus(total: number): WeekStatus {
  if (total === 0) return TIMESHEET.STATUS.MISSING;
  if (total < TIMESHEET.TARGET_HOURS) return TIMESHEET.STATUS.INCOMPLETE;
  if (total > TIMESHEET.TARGET_HOURS) return TIMESHEET.STATUS.OVERTIME;
  return TIMESHEET.STATUS.COMPLETED;
}

export function syncStatuses(weeks: Week[], entries: Entry[]): Week[] {
  return weeks.map((w) => ({ ...w, status: deriveStatus(getTotalHours(entries, w.id)) }));
}

export function actionLabel(status: WeekStatus): string {
  if (status === "Completed") return "View";
  if (status === "Missing") return "Create";
  return "Update";
}

export type SortColumn = "weekNumber" | "date" | "status";

export function compareWeeks(a: Week, b: Week, col: SortColumn, dir: "asc" | "desc"): number {
  const sign = dir === "asc" ? 1 : -1;
  if (col === "weekNumber") return sign * (a.weekNo - b.weekNo);
  if (col === "date") {
    const c = a.startDate.localeCompare(b.startDate);
    return c !== 0 ? sign * c : sign * a.endDate.localeCompare(b.endDate);
  }
  return sign * a.status.localeCompare(b.status);
}
