
import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";
import { API } from "./constants";
import { ApiError, NetworkError } from "./errors";

interface CacheEntry {
  promise: Promise<unknown>;
  ts: number;
}

class HttpClient {
  private ax: AxiosInstance;
  private cache = new Map<string, CacheEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.ax = axios.create({
      baseURL: API.BASE_URL,
      timeout: API.TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });

    // Response interceptor — transform errors
    this.ax.interceptors.response.use(
      (r) => r,
      (err: AxiosError) => this.transformError(err),
    );

    // Cleanup stale cache entries every 5 minutes
    if (typeof window !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanupStaleCache(), 5 * 60 * 1000);
    }
  }

  // ─── Public API ───────────────────────────────────

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const key = `GET:${url}`;
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.ts < API.DEDUP_WINDOW) {
      return cached.promise as Promise<T>;
    }
    const p = this.withRetry(() => this.ax.get<T>(url, config).then((r) => r.data));
    this.cache.set(key, { promise: p, ts: Date.now() });
    return p;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.withRetry(() => this.ax.post<T>(url, data, config).then((r) => r.data));
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.withRetry(() => this.ax.put<T>(url, data, config).then((r) => r.data));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.withRetry(() => this.ax.delete<T>(url, config).then((r) => r.data));
  }

  clearCache(pattern?: string) {
    if (!pattern) { this.cache.clear(); return; }
    for (const k of this.cache.keys()) if (k.includes(pattern)) this.cache.delete(k);
  }

  private cleanupStaleCache() {
    const now = Date.now();
    const maxAge = API.DEDUP_WINDOW * 2; // Keep entries for 2x dedup window
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.ts > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  // ─── Internals ────────────────────────────────────

  private async withRetry<T>(op: () => Promise<T>, attempt = 1): Promise<T> {
    try {
      return await op();
    } catch (err) {
      // Don't retry client errors (4xx)
      if (err instanceof ApiError && err.statusCode >= 400 && err.statusCode < 500) throw err;
      if (attempt >= API.MAX_RETRIES) throw err;
      await new Promise((r) => setTimeout(r, API.RETRY_DELAY * Math.pow(API.RETRY_BACKOFF, attempt - 1)));
      return this.withRetry(op, attempt + 1);
    }
  }

  private transformError(err: AxiosError): never {
    if (err.response) {
      const { status, data } = err.response;
      const msg = (data as Record<string, unknown>)?.message as string || err.message;
      throw new ApiError(status || 500, msg, { url: err.config?.url });
    }
    if (err.code === "ECONNABORTED") {
      throw new NetworkError("Request timed out — please try again.", { url: err.config?.url });
    }
    throw new NetworkError(err.message || "Network error — check your connection.", { url: err.config?.url });
  }
}

export const http = new HttpClient();
