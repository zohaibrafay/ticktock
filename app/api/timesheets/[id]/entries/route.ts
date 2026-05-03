import { NextRequest } from "next/server";
import { entryFormSchema, entrySchema, extractErrors } from "@/lib/schemas";
import { ok, fail } from "@/lib/api-helpers";
import { ValidationError } from "@/lib/errors";
import { TimeSheets } from "@/data/mock-timesheets";

/** GET /api/timesheets/[id]/entries */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entries = TimeSheets.filter((e) => e.wId === id);
    return ok(entries);
  } catch (e) {
    return fail(e as Error);
  }
}

/** POST /api/timesheets/[id]/entries */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const r = entryFormSchema.extend({ date: entrySchema.shape.date }).safeParse(data);
    if (!r.success) throw new ValidationError("Invalid entry", extractErrors(r.error));
    const entry = { id: `e${Date.now()}`, wId: id, ...r.data };
    TimeSheets.push(entry);
    return ok(entry, 201);
  } catch (e) {
    return fail(e as Error);
  }
}
