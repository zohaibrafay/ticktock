"use client";

import { TIMESHEET } from "@/lib/constants";
import { formatWeekRange } from "@/lib/utils";
import type { Week } from "@/lib/schemas";

interface Props {
  week: Week;
  totalHours: number;
  overtimeHours: number;
  progress: number;
}

export default function ProgressHeader({ week, totalHours, overtimeHours, progress }: Props) {
  const target = TIMESHEET.TARGET_HOURS;
  const barColor = overtimeHours > 0
    ? "from-orange-400 to-orange-500"
    : progress >= 100
      ? "from-emerald-400 to-emerald-500"
      : "from-primary to-accent";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Week {week.weekNo} Timesheet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatWeekRange(week.startDate, week.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-lg font-bold text-foreground">{totalHours}<span className="text-sm font-normal text-muted-foreground">/{target} hrs</span></p>
            {overtimeHours > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-800">
                +{overtimeHours} hrs overtime
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
