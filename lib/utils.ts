import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}






export function resolveDateRange(
  key: string
): { from: Date; to: Date } | null {
  const today = new Date();

  const startOfWeek = getWeekStart(today);

  const handlers: Record<string, () => { from: Date; to: Date }> = {
    this_week: () => ({
      from: startOfWeek,
      to: addDays(startOfWeek, 6),
    }),

    last_week: () => ({
      from: addDays(startOfWeek, -7),
      to: addDays(startOfWeek, -1),
    }),

    this_month: () => ({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    }),
  };

  return handlers[key]?.() ?? null;
}
export function getParseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}


export function formatWeekRange(start: string, end: string): string {
  const s = getParseDate(start);
  const e = getParseDate(end);
  const month = (d: Date) => d.toLocaleDateString("en-GB", { month: "long" });

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()} - ${e.getDate()} ${month(s)} ${s.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} ${month(s)} - ${e.getDate()} ${month(e)} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${month(s)} ${s.getFullYear()} - ${e.getDate()} ${month(e)} ${e.getFullYear()}`;
}
export function formatShortDate(dateStr: string): string {
  return getParseDate(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDayName(dateStr: string): string {
  return getParseDate(dateStr).toLocaleDateString("en-GB", { weekday: "long" });
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = getParseDate(start);
  const last = getParseDate(end);
  while (cur <= last) {
    dates.push(toLocalDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const offset = (d.getDay() + 6) % 7; // Monday start

  d.setDate(d.getDate() - offset);
  d.setHours(0, 0, 0, 0);

  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}