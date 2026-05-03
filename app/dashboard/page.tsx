"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeeks } from "@/hooks/use-weeks";
import { syncStatuses } from "@/services/week-status.service";
import {
  compareWeeks,
  actionLabel,
  type SortColumn,
} from "@/services/week-status.service";
import { formatWeekRange, getParseDate, resolveDateRange } from "@/lib/utils";
import { storage } from "@/services/storage.service";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { ArrowUp, ArrowDown } from "lucide-react";
import { DEFAULTPAGINATION, STATUS_OPTIONS, Option, WEEKRANGE_OPTIONS } from "@/lib/constants";
import Pagination from "@/components/ui/Pagination";
import { useSession } from "next-auth/react";
import { Dropdown } from "@/components/ui/Dropdown";


interface PaginationType {
  pSize: number;
  pNumber: number;
}
interface Filters {
  weekRange?: string;
  status?: string;
}
interface SortType {
  col: SortColumn;
  dir: "asc" | "desc";
}


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { weeks: rawWeeks, loading, error, fetchWeeks } = useWeeks();
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationType>({ pSize: DEFAULTPAGINATION.DEFAULT_PAGE_SIZE, pNumber: DEFAULTPAGINATION.DEFAULT_PAGE_NUMBER });
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<SortType>({ col: "weekNumber", dir: "asc" });


  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchWeeks();
  }, [status, session, fetchWeeks, router]);


  const weeks = useMemo(() => {
    const entries = storage.getEntries();
    return entries.length > 0 ? syncStatuses(rawWeeks, entries) : rawWeeks;
  }, [rawWeeks]);



  const filtered = useMemo(() => {
    const dateRange = filters.weekRange
      ? resolveDateRange(filters.weekRange)
      : null;

    return weeks
      .filter((w) => {
        if (filters.status && filters.status !== "All" && w.status !== filters.status) {
          return false;
        }

        if (dateRange) {
          const ws = getParseDate(w.startDate);
          const we = getParseDate(w.endDate);

          if (we < dateRange.from || ws > dateRange.to) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) =>
        compareWeeks(a, b, sort.col, sort.dir)
      );
  }, [weeks, filters.status, filters.weekRange, sort.col, sort.dir]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pNumber: 1,
    }));
  }, [filters, sort.col, sort.dir]);

  const handlePagination = useCallback((pNumber: number, pSize: number) => {
    setPagination((prev) => ({ ...prev, pNumber, pSize }));
  }, []);

  const paginated = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.pSize));
    const safePage = Math.min(pagination.pNumber, totalPages);
    const start = (safePage - 1) * pagination.pSize;
    return filtered.slice(start, start + pagination.pSize);
  }, [filtered, pagination.pNumber, pagination.pSize]);

  const handleSort = useCallback((col: SortColumn) => {
    setPagination((prev) => ({ ...prev, pNumber: 1 }));
    setSort((p) =>
      p.col === col
        ? { col, dir: p.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );
  }, []);

  function SortIcon({ col }: { col: SortColumn }) {
    if (sort.col !== col) return <ArrowDown size={12} className="opacity-30" />;
    return sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  }


  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card shadow-card p-4">
        <h1 className="text-xl font-bold text-foreground mb-4">
          Your Timesheets
        </h1>
        <div className="flex flex-wrap gap-3 mb-2">
          <Dropdown<Option>
            options={WEEKRANGE_OPTIONS}
            value={
              WEEKRANGE_OPTIONS.find((o) => o.value === filters.weekRange) || null
            }
            onChange={(val: Option) => {
              setFilters((prev) => ({ ...prev, weekRange: val.value || undefined }));
              setPagination((prev) => ({ ...prev, pNumber: 1 }));
            }}
            getLabel={(o: Option) => o.label}
            getValue={(o: Option) => o.value}
            placeholder="Date Range"
          />

          <Dropdown<Option>
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((o) => o.value === filters.status) || null}
            onChange={(val: Option) => {
              setFilters((prev) => ({ ...prev, status: val.value || undefined }));
              setPagination((prev) => ({ ...prev, pNumber: 1 }));
            }}
            getLabel={(o: Option) => o.label}
            getValue={(o: Option) => o.value}
            placeholder="Status"
          />
        </div>

        {!loading && error && (
          <div className="p-4">
            <ErrorAlert message={error.message} onRetry={fetchWeeks} />
          </div>
        )}
        <div className="overflow-x-auto rounded-lg shadow-card border">
          <table className="w-full table-fixed  border-collapse text-sm bg-gray-50 ">
            <colgroup>
              <col className="min-w-[130px]  w-[7%]" />
              <col className="min-w-[170px]  w-[43%]" />
              <col className="min-w-[126px]  w-[43%]" />
              <col className="min-w-[107px]  w-[7%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {(["weekNumber", "date", "status"] as const).map((col) => (
                  <th key={col} className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort(col)}
                      className={`flex items-center gap-1 transition-colors hover:text-foreground ${sort.col === col ? "text-foreground" : ""}`}
                    >
                      {col === "weekNumber"
                        ? "Week #"
                        : col === "date"
                          ? "Date Range"
                          : "Status"}
                      <SortIcon col={col} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">
                      <div className="h-4 w-10 shimmer rounded" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-4 w-44 shimmer rounded" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-5 w-20 shimmer rounded-full" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="ml-auto h-4 w-14 shimmer rounded" />
                    </td>
                  </tr>
                ))}

              {!loading && !error && paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No timesheets found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                paginated.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/50 w-full"
                  >
                    <td className="px-4 py-2 font-normal text-sm text-foreground ">
                      {w.weekNo}
                    </td>
                    <td className="px-4 py-2 font-normal text-sm text-muted-foreground bg-white">
                      {formatWeekRange(w.startDate, w.endDate)}
                    </td>
                    <td className="px-4 py-2 bg-white">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-2 text-center bg-white">
                      <button
                        onClick={() => router.push(`/dashboard/${w.id}`)}
                        className="rounded-lg px-3 py-1.5 text-base font-normal text-primary transition-all hover:bg-primary/10 active:scale-95"
                      >
                        {actionLabel(w.status)}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination pSize={pagination.pSize} pNumber={pagination.pNumber} totalLength={filtered.length} handlePagination={handlePagination}
        />
      </div>
    </div>
  );
}
