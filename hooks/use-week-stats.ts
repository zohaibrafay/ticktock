"use client";

import { useMemo } from "react";
import { getTotalHours, getOvertime, getProgress, deriveStatus } from "@/services/week-status.service";
import type { Week, Entry } from "@/lib/schemas";

export function useWeekStats(week: Week | null, entries: Entry[]) {
  return useMemo(() => {
    if (!week) return null;
    const total = getTotalHours(entries, week.id);
    const status = deriveStatus(total);
    return {
      totalHours: total,
      overtimeHours: getOvertime(total),
      progress: getProgress(total),
      status,
      isCompleted: status === "Completed" || status === "Overtime",
    };
  }, [week, entries]);
}
