"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 animate-in fade-in slide-in-from-top-2">
      <AlertCircle size={16} className="shrink-0 text-destructive" />
      <p className="flex-1 text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <RotateCcw size={12} />
          Retry
        </button>
      )}
    </div>
  );
}
