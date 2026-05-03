"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle size={32} className="text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or go back to the dashboard.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mx-auto mt-2 max-w-lg overflow-auto rounded-lg bg-destructive/5 p-3 text-left text-xs text-destructive">
            {error.message}
          </pre>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg gradient-bg px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <RotateCcw size={14} /> Try Again
        </button>
        <a
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
        >
          <Home size={14} /> Dashboard
        </a>
      </div>
    </div>
  );
}
