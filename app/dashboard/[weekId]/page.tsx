"use client";

import dynamic from "next/dynamic";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeeks } from "@/hooks/use-weeks";
import { useWeekEntries } from "@/hooks/use-week-entries";
import { useWeekStats } from "@/hooks/use-week-stats";
import { getDatesInRange, formatShortDate, formatDayName } from "@/lib/utils";
import ProgressHeader from "@/components/timesheet/ProgressHeader";
import EntryCard from "@/components/timesheet/EntryCard";
import ConfirmDelete from "@/components/timesheet/ConfirmDelete";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { Plus, ArrowLeft } from "lucide-react";
import type { Entry } from "@/lib/schemas";
import WeekDetailLoading from "./loading";

const EntryModal = dynamic(() => import("@/components/timesheet/EntryModal"), {
  ssr: false,
  loading: () => null,
});

export default function WeekDetailPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = use(params);
  const router = useRouter();

  const { weeks, fetchWeeks } = useWeeks();
  const {
    entries,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useWeekEntries(weekId);

  const week = weeks.find((w) => w.id === weekId) ?? null;
  const stats = useWeekStats(week, entries);

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    entry: Entry | null;
    date: string;
  }>({
    open: false,
    entry: null,
    date: "",
  });
  // Delete confirmation
  const [deleting, setDeleting] = useState<{ entryId: string; open: boolean }>({
    entryId: "",
    open: false,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const dates = useMemo(
    () => (week ? getDatesInRange(week.startDate, week.endDate) : []),
    [week],
  );

  const entriesByDate = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const d of dates) map[d] = entries.filter((e) => e.date === d);
    return map;
  }, [dates, entries]);

  const openAdd = useCallback(
    (date: string) => setModal({ open: true, entry: null, date }),
    [],
  );
  const openEdit = useCallback(
    (entry: Entry) => setModal({ open: true, entry, date: entry.date }),
    [],
  );
  const closeModal = useCallback(
    () => setModal({ open: false, entry: null, date: "" }),
    [],
  );

  const handleSubmit = useCallback(
    async (payload: {
      project: string;
      workType: string;
      description: string;
      hrs: number;
    }) => {
      if (modal.entry) {
        await updateEntry(modal.entry.id, payload);
      } else {
        await createEntry({ ...payload, date: modal.date });
      }
    },
    [modal, createEntry, updateEntry],
  );

  const handleDeleteConfirm = useCallback(async () => {
    setDeleteLoading(true);
    await deleteEntry(deleting.entryId);
    setDeleteLoading(false);
    setDeleting({ entryId: "", open: false });
  }, [deleting.entryId, deleteEntry]);

  if (loading && entries.length === 0) {
    return <WeekDetailLoading />;
    // return (
    //   <div className="space-y-4">
    //     <div className="h-6 w-32 shimmer rounded-lg" />
    //     <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
    //       {[...Array(5)].map((_, i) => <div key={i} className="h-14 shimmer rounded-xl" />)}
    //     </div>
    //   </div>
    // );
  }

  if (!week) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">Week not found.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-white"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to timesheets
      </button>

      {/* Progress card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {stats && (
          <ProgressHeader
            week={week}
            totalHours={stats.totalHours}
            overtimeHours={stats.overtimeHours}
            progress={stats.progress}
          />
        )}
      </div>

      {/* Error */}
      {error && <ErrorAlert message={error.message} onRetry={fetchEntries} />}

      {/* Day groups */}
      <div className="space-y-6">
        {dates.map((date) => {
          const dayEntries = entriesByDate[date] ?? [];
          const dayTotal = dayEntries.reduce((s, e) => s + e.hrs, 0);

          return (
            <div key={date} className="space-y-2">
              {/* Day header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {formatDayName(date)}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatShortDate(date)}
                  </span>
                </div>
                {dayTotal > 0 && (
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {dayTotal} hrs
                  </span>
                )}
              </div>

              {/* Entries */}
              <div className="space-y-2">
                {dayEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={openEdit}
                    onDelete={(id) => setDeleting({ entryId: id, open: true })}
                  />
                ))}

                {/* Add button */}
                <button
                  onClick={() => openAdd(date)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-3 text-sm font-medium text-primary transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
                >
                  <Plus size={14} />
                  Add entry
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Entry modal */}
      {modal.open && (
        <EntryModal
          key={modal.entry?.id ?? `new-${modal.date}`}
          entry={modal.entry}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDelete
        open={deleting.open}
        title="Delete Entry"
        message="This action cannot be undone. Are you sure?"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleting({ entryId: "", open: false })}
      />
    </div>
  );
}
