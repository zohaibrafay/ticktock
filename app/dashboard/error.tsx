"use client";

import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle size={24} className="text-destructive" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">Failed to load timesheets</h2>
        <p className="mb-1 text-sm text-muted-foreground">
          Something went wrong while loading your data.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mx-auto my-3 max-w-lg overflow-auto rounded-lg bg-destructive/5 p-3 text-left text-xs text-destructive">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg gradient-bg px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <RotateCcw size={14} /> Retry
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
          >
            <ArrowLeft size={14} /> Go Back
          </a>
        </div>
      </div>
    </div>
  );
}
