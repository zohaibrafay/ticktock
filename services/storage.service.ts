/**
 * localStorage cache service.
 * Read-through cache — API is source of truth, storage is for offline / speed.
 */

import { STORAGE } from "@/lib/constants";
import type { Week, Entry } from "@/lib/schemas";

interface StoredData {
  weeks: Week[];
  entries: Entry[];
  lastSync: number;
}

class StorageService {
  private key = STORAGE.DB_KEY;

  private available(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const t = "__test__";
      localStorage.setItem(t, t);
      localStorage.removeItem(t);
      return true;
    } catch {
      return false;
    }
  }

  read(): StoredData | null {
    if (!this.available()) return null;
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredData>;
      if (!Array.isArray(parsed.weeks) || !Array.isArray(parsed.entries)) return null;
      // Expired?
      if (parsed.lastSync && Date.now() - parsed.lastSync > STORAGE.CACHE_TTL) {
        this.clear();
        return null;
      }
      return { weeks: parsed.weeks, entries: parsed.entries, lastSync: parsed.lastSync ?? Date.now() };
    } catch {
      return null;
    }
  }

  write(data: Omit<StoredData, "lastSync">) {
    if (!this.available()) return;
    try {
      localStorage.setItem(this.key, JSON.stringify({ ...data, lastSync: Date.now() }));
    } catch (e) {
      if (e instanceof Error && e.name === "QuotaExceededError") this.clear();
    }
  }

  getWeeks(): Week[] {
    return this.read()?.weeks ?? [];
  }

  getEntries(weekId?: string): Entry[] {
    const all = this.read()?.entries ?? [];
    return weekId ? all.filter((e) => e.wId === weekId) : all;
  }

  setWeeks(weeks: Week[]) {
    const cur = this.read();
    this.write({ weeks, entries: cur?.entries ?? [] });
  }

  setEntries(entries: Entry[]) {
    const cur = this.read();
    this.write({ weeks: cur?.weeks ?? [], entries });
  }

  upsertEntry(entry: Entry) {
    const cur: StoredData = this.read() ?? { weeks: [], entries: [], lastSync: Date.now() };
    const idx = cur.entries.findIndex((e) => e.id === entry.id);
    if (idx >= 0) cur.entries[idx] = entry;
    else cur.entries.push(entry);
    this.write(cur);
  }

  removeEntry(entryId: string) {
    const cur: StoredData = this.read() ?? { weeks: [], entries: [], lastSync: Date.now() };
    cur.entries = cur.entries.filter((e) => e.id !== entryId);
    this.write(cur);
  }

  clear() {
    if (!this.available()) return;
    try { localStorage.removeItem(this.key); } catch { /* noop */ }
  }
}

export const storage = new StorageService();
