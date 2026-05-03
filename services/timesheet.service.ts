/**
 * Timesheet API service — all data access goes through here.
 * Validates responses, caches to storage, clears cache on mutations.
 */

import { http } from "@/lib/http";
import { weekSchema, entrySchema, extractErrors, type Week, type Entry } from "@/lib/schemas";
import { ValidationError, normalizeError } from "@/lib/errors";
import { storage } from "./storage.service";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

class TimesheetService {
  private base = "/timesheets";

  // ─── Weeks ────────────────────────────────────────

  async fetchWeeks(): Promise<Week[]> {
    const res = await http.get<ApiEnvelope<unknown[]>>(this.base);
    const weeks: Week[] = [];
    for (const item of res.data) {
      const r = weekSchema.safeParse(item);
      if (r.success) weeks.push(r.data);
    }
    storage.setWeeks(weeks);
    return weeks;
  }

  async createWeek(payload: { weekNumber: number; startDate: string; endDate: string }): Promise<Week> {
    const res = await http.post<ApiEnvelope<unknown>>(this.base, { ...payload, status: "Missing" });
    const r = weekSchema.safeParse(res.data);
    if (!r.success) throw new ValidationError("Bad server response", extractErrors(r.error));
    http.clearCache(this.base);
    return r.data;
  }

  async updateWeek(weekId: string, payload: Partial<Omit<Week, "id">>): Promise<Week> {
    const res = await http.put<ApiEnvelope<unknown>>(`${this.base}/${weekId}`, payload);
    const r = weekSchema.safeParse(res.data);
    if (!r.success) throw new ValidationError("Bad server response", extractErrors(r.error));
    http.clearCache(this.base);
    return r.data;
  }

  async deleteWeek(weekId: string): Promise<void> {
    await http.delete(`${this.base}/${weekId}`);
    http.clearCache(this.base);
  }

  // ─── Entries ──────────────────────────────────────

  async fetchEntries(weekId: string): Promise<Entry[]> {
    const res = await http.get<ApiEnvelope<unknown[]>>(`${this.base}/${weekId}/entries`);
    const entries: Entry[] = [];
    for (const item of res.data) {
      const r = entrySchema.safeParse(item);
      if (r.success) entries.push(r.data);
    }
    // Merge into storage
    const existing = storage.getEntries().filter((e) => e.wId !== weekId);
    storage.setEntries([...existing, ...entries]);
    return entries;
  }

  async createEntry(weekId: string, payload: { date: string; hours: number; description: string; project: string; workType: string }): Promise<Entry> {
    const res = await http.post<ApiEnvelope<unknown>>(`${this.base}/${weekId}/entries`, payload);
    const r = entrySchema.safeParse(res.data);
    if (!r.success) throw new ValidationError("Bad server response", extractErrors(r.error));
    storage.upsertEntry(r.data);
    http.clearCache(this.base);
    return r.data;
  }

  async updateEntry(weekId: string, entryId: string, payload: Partial<Omit<Entry, "id" | "weekId">>): Promise<Entry> {
    const res = await http.put<ApiEnvelope<unknown>>(`${this.base}/${weekId}/entries/${entryId}`, payload);
    const r = entrySchema.safeParse(res.data);
    if (!r.success) throw new ValidationError("Bad server response", extractErrors(r.error));
    storage.upsertEntry(r.data);
    http.clearCache(this.base);
    return r.data;
  }

  async deleteEntry(weekId: string, entryId: string): Promise<void> {
    await http.delete(`${this.base}/${weekId}/entries/${entryId}`);
    storage.removeEntry(entryId);
    http.clearCache(this.base);
  }
}

export const timesheetService = new TimesheetService();
