import { cn } from "@/lib/utils";
import type { WeekStatus } from "@/lib/constants";
import React from "react";

const styles: Record<string, string> = {
  Completed:  "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
  Incomplete: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
  Overtime:   "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-800",
  Missing:    "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
};

const dots: Record<string, string> = {
  Completed:  "bg-emerald-500",
  Incomplete: "bg-amber-500",
  Overtime:   "bg-orange-500",
  Missing:    "bg-slate-400",
};

function StatusBadge({ status }: { status: WeekStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
        styles[status] ?? styles.Missing,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[status] ?? dots.Missing)} />
      {status}
    </span>
  );
}

export default React.memo(StatusBadge);
