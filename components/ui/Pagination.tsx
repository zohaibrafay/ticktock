"use client";
import { DEFAULTPAGINATION } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface Props {
    pSize: number;
    pNumber: number;
    totalLength: number;
    handlePagination: (page: number,limit: number) => void;
}
function buildPagination(
  current: number,
  total: number
): (number | "...")[] {
  const pages: (number | "...")[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      Math.abs(i - current) <= 1
    ) {
      pages.push(i);
    }
  }

  return pages.reduce<(number | "...")[]>((acc, p, i, arr) => {
    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
      acc.push("...");
    acc.push(p);
    return acc;
  }, []);
}
export default function Pagination({
  pSize,
  pNumber,
  totalLength,
  handlePagination,
}: Props) {
    const totalPages:number = useMemo(() => Math.max(1, Math.ceil(totalLength / pSize)), [totalLength, pSize]);
  
     const pages = useMemo(() => buildPagination(pNumber, totalPages),
    [pNumber, totalPages]
  );

    return (
        <div className="flex items-center justify-between p-4">
          <div className="rounded-lg border border-input bg-card bg-gray-50  px-2 text-sm text-foreground outline-none transition-all ">
            <select
              value={pSize}
              onChange={(e) => {handlePagination(1, Number(e.target.value))}}
              className="px-1 py-2 focus:outline-none "
            >
              {DEFAULTPAGINATION.PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} per page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center  border rounded-lg">
            <button
              disabled={pNumber === 1}
              onClick={() => handlePagination(pNumber - 1, pSize)}
              className="flex items-center gap-1  px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {pages.map((p, i) =>
          p === "..." ? (
            <span key={`page-ellipsis-${i}`} className="px-2 py-1.5 text-sm border">
              …
            </span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => handlePagination(p, pSize)}
              className={`min-w-[2rem] px-2 py-1.5 text-sm border ${
                pNumber === p
                  ? "bg-muted text-primary"
                  : "hover:bg-muted"
              }`}
            >
              {p}
            </button>
          )
        )}

            <button className="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              disabled={pNumber === totalPages}
              onClick={() => handlePagination(pNumber + 1, pSize)} 
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
    );
}
