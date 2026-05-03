"use client";

import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { entryFormSchema, extractErrors } from "@/lib/schemas";
import { PROJECT_OPTIONS, WORK_TYPE_OPTIONS, TIMESHEET } from "@/lib/constants";
import type { Entry } from "@/lib/schemas";

interface Props {
  entry: Entry | null;
  onClose: () => void;
  onSubmit: (payload: { project: string; workType: string; description: string; hrs: number }) => Promise<void>;
}

export default function EntryModal({ entry, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    project: entry?.project ?? "",
    workType: entry?.workType ?? "",
    description: entry?.description ?? "",
    hrs: entry?.hrs ?? TIMESHEET.DEFAULT_HOURS,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined as unknown as string }));
  }

  async function handleSubmit() {
    const r = entryFormSchema.safeParse(form);
    if (!r.success) { setErrors(extractErrors(r.error)); return; }
    setSubmitting(true);
    try {
      await onSubmit(r.data);
      onClose();
    } catch {
      setSubmitting(false);
    }
  }

  const adjustHours = (delta: number) => {
    setForm((p) => ({
      ...p,
      hrs: Math.max(TIMESHEET.MIN_HOURS_PER_ENTRY, Math.min(TIMESHEET.MAX_HOURS_PER_ENTRY, p.hrs + delta)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {entry ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <FormField id="project" label="Project" type="select" value={form.project} error={errors.project} options={PROJECT_OPTIONS} required onChange={(v) => set("project", v)} placeholder="Select project" />
          <FormField id="workType" label="Type of Work" type="select" value={form.workType} error={errors.workType} options={WORK_TYPE_OPTIONS} required onChange={(v) => set("workType", v)} placeholder="Select type" />
          <FormField id="description" label="Task Description" type="textarea" value={form.description} error={errors.description} required onChange={(v) => set("description", v)} placeholder="Describe what you worked on..." hint="At least 5 characters" />

          {/* Hours stepper */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Hours <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => adjustHours(-0.5)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-input text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
              >
                <Minus size={14} />
              </button>
              <div className="flex min-w-[3rem] items-center justify-center rounded-lg bg-muted px-3 py-1.5">
                <span className="text-sm font-semibold text-foreground">{form.hrs}</span>
              </div>
              <button
                type="button"
                onClick={() => adjustHours(0.5)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-input text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
              >
                <Plus size={14} />
              </button>
              <span className="text-xs text-muted-foreground">
                {TIMESHEET.MIN_HOURS_PER_ENTRY}–{TIMESHEET.MAX_HOURS_PER_ENTRY} hrs
              </span>
            </div>
            {errors.hours && <p className="text-xs text-destructive">{errors.hours}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-lg gradient-bg py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Saving..." : entry ? "Save Changes" : "Add Entry"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
