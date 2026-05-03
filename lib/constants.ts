export type Option = {
  label: string;
  value: string;
};
export const WEEKRANGE_OPTIONS: Option[] = [
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
];

export const STATUS_OPTIONS: Option[] = [
  { label: "ALL", value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Overtime", value: "Overtime" },
  { label: "Incomplete", value: "Incomplete" },
  { label: "Missing", value: "Missing" },
];


export const DEFAULTPAGINATION = {
  PAGE_SIZES: [5, 10,15, 20,30 ] as const,
  DEFAULT_PAGE_SIZE: 5,
  DEFAULT_PAGE_NUMBER: 1,
  DEFAULT_LENGTH: 0,
} as const;


export const TIMESHEET = {
  TARGET_HOURS: 40,
  MIN_HOURS_PER_ENTRY: 0.5,
  MAX_HOURS_PER_ENTRY: 12,
  DEFAULT_HOURS: 8,
  DESCRIPTION_MIN: 5,
  DESCRIPTION_MAX: 500,
  PROJECT_MAX: 100,
  WORK_TYPE_MAX: 50,

  STATUS: {
    MISSING: "Missing",
    INCOMPLETE: "Incomplete",
    COMPLETED: "Completed",
    OVERTIME: "Overtime",
  } as const,
} as const;

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  TIMEOUT: 10_000,
  SLOW_THRESHOLD: 3_000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1_000,
  RETRY_BACKOFF: 2,
  DEDUP_WINDOW: 500,
} as const;

export const STORAGE = {
  DB_KEY: "aiticktock.db",
  CACHE_TTL: 5 * 60 * 1_000, // 5 min
} as const;

export const AUTH = {
  SECRET: process.env.AUTH_SECRET || "dev-only-secret-change-in-production",
  SIGN_IN_PAGE: "/login",
  DASHBOARD: "/dashboard",
  SESSION_MAX_AGE: 24 * 60 * 60,
} as const;



export const PROJECT_OPTIONS = [
  { label: "Alert", value: "Alert" },
  { label: "Balance", value: "Balance" },
  { label: "Schedule", value: "Schedule" },
  { label: "Compliance", value: "Compliance" },
  { label: "Internal", value: "Internal" },
] as const;

export const WORK_TYPE_OPTIONS = [
  { label: "Planning", value: "Planning" },
  { label: "Design", value: "Design" },
  { label: "Deploy", value: "Deploy" },
  { label: "Bug Fix", value: "Bug Fix" },
  { label: "Development", value: "Development" },
  { label: "Requirement", value: "Requirement" },
  { label: "Testing", value: "Testing" },
  { label: "Approval", value: "Approval" },
  { label: "Under Review", value: "Under Review" },
  { label: "Feature", value: "Feature" },
  { label: "UAT Test", value: "UAT Test" },
  { label: "Beta", value: "Beta" },
] as const;

export type WeekStatus = (typeof TIMESHEET.STATUS)[keyof typeof TIMESHEET.STATUS];
