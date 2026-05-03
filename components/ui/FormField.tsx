"use client";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "select" | "textarea";
  value: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
}

export default function FormField({
  id, label, type = "text", value, error, hint, placeholder, required, options, onChange,
}: FormFieldProps) {
  const base = cn(
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all duration-200",
    "bg-card text-foreground placeholder:text-muted-foreground",
    error
      ? "border-destructive/60 ring-2 ring-destructive/20 focus:ring-destructive/40"
      : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground block space-y-2">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      {type === "select" && options ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">{placeholder ?? "Select..."}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, "resize-none")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}

      {error && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
