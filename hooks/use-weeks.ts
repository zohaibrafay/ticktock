"use client";

import { useCallback, useState } from "react";
import { timesheetService } from "@/services/timesheet.service";
import { storage } from "@/services/storage.service";
import { AppError, normalizeError } from "@/lib/errors";
import type { Week } from "@/lib/schemas";

interface State {
  weeks: Week[];
  loading: boolean;
  error: AppError | null;
}

export function useWeeks() {
  const [state, setState] = useState<State>({ weeks: [], loading: false, error: null });

  const fetchWeeks = useCallback(async () => {
    setState({ weeks: [], loading: true, error: null });
    try {
      // Try cache first
      const cached = storage.getWeeks();
      if (cached.length > 0) {
        setState({ weeks: cached, loading: false, error: null });
        return;
      }
      const weeks = await timesheetService.fetchWeeks();
      setState({ weeks, loading: false, error: null });
    } catch (e) {
      setState({ weeks: [], loading: false, error: normalizeError(e) });
    }
  }, []);

  const refresh = useCallback(async () => {
    storage.clear();
    setState({ weeks: [], loading: true, error: null });
    try {
      const weeks = await timesheetService.fetchWeeks();
      setState({ weeks, loading: false, error: null });
    } catch (e) {
      setState({ weeks: [], loading: false, error: normalizeError(e) });
    }
  }, []);

  return {
    ...state,
    fetchWeeks,
    refresh,
    clearError: useCallback(() => setState((s) => ({ ...s, error: null })), []),
  };
}
