"use client";

import { useCallback, useState } from "react";
import { timesheetService } from "@/services/timesheet.service";
import { storage } from "@/services/storage.service";
import { AppError, normalizeError } from "@/lib/errors";
import type { Entry } from "@/lib/schemas";

interface State {
  entries: Entry[];
  loading: boolean;
  submitting: boolean;
  error: AppError | null;
}

const INIT: State = { entries: [], loading: false, submitting: false, error: null };

export function useWeekEntries(wId: string | null) {
  const [state, setState] = useState<State>(INIT);

  const fetchEntries = useCallback(async () => {
    if (!wId) return;
    
    setState({ ...INIT, loading: true });
   
    try {
      const cached = storage.getEntries(wId);
      if (cached.length > 0) {
        setState({ entries: cached, loading: false, submitting: false, error: null });
        return;
      }
      const entries = await timesheetService.fetchEntries(wId);
      setState({ entries, loading: false, submitting: false, error: null });
    } catch (e) {
      setState({ entries: [], loading: false, submitting: false, error: normalizeError(e) });
    }
  }, [wId]);

  const createEntry = useCallback(async (payload: { date: string; hrs: number; description: string; project: string; workType: string }) => {
    if (!wId) return;
    setState((s) => ({ ...s, submitting: true, error: null }));
    try {
      const entry = await timesheetService.createEntry(wId, payload);
      setState((s) => ({ entries: [...s.entries, entry], loading: false, submitting: false, error: null }));
      return entry;
    } catch (e) {
      setState((s) => ({ ...s, submitting: false, error: normalizeError(e) }));
      throw e;
    }
  }, [wId]);

  const updateEntry = useCallback(async (entryId: string, payload: Partial<Omit<Entry, "id" | "wId">>) => {
    if (!wId) return;
    setState((s) => ({ ...s, submitting: true, error: null }));
    try {
      const updated = await timesheetService.updateEntry(wId, entryId, payload);
      setState((s) => ({
        entries: s.entries.map((e) => (e.id === entryId ? updated : e)),
        loading: false, submitting: false, error: null,
      }));
      return updated;
    } catch (e) {
      setState((s) => ({ ...s, submitting: false, error: normalizeError(e) }));
      throw e;
    }
  }, [wId]);

  const deleteEntry = useCallback(async (entryId: string) => {
    if (!wId) return;
    setState((s) => ({ ...s, submitting: true, error: null }));
    try {
      await timesheetService.deleteEntry(wId, entryId);
      setState((s) => ({
        entries: s.entries.filter((e) => e.id !== entryId),
        loading: false, submitting: false, error: null,
      }));
    } catch (e) {
      setState((s) => ({ ...s, submitting: false, error: normalizeError(e) }));
      throw e;
    }
  }, [wId]);

  return {
    ...state,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    clearError: useCallback(() => setState((s) => ({ ...s, error: null })), []),
  };
}
