"use client";

import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Entry } from "@/lib/schemas";

interface Props {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (entryId: string) => void;
}

const projectColors: Record<string, string> = {
  Ticktock:  "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Internal:  "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  Other:     "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function EntryCard({ entry, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/20 hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{entry.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{entry.workType}</p>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
          {entry.hrs} hrs
        </span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${projectColors[entry.project] ?? projectColors.Other}`}>
          {entry.project}
        </span>

        {/* Actions menu */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((p) => !p)}
            className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted"
          >
            <MoreHorizontal size={16} />
          </button>

          {open && (
            <div className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => { onEdit(entry); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                Edit
              </button>
              <button
                onClick={() => { onDelete(entry.id); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/5"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
