import { NextRequest } from "next/server";
import { entrySchema, extractErrors } from "@/lib/schemas";
import { ok, fail, notFound } from "@/lib/api-helpers";
import { ValidationError } from "@/lib/errors";
import { TimeSheets } from "@/data/mock-timesheets";

/** PUT /api/timesheets/[id]/entries/[entryId] */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  try {
    const { id, entryId } = await params;
    const idx = TimeSheets.findIndex((e) => e.id === entryId && e.wId === id);
    if (idx === -1) return notFound("Entry not found");

    const body = await req.json();
    const merged = { ...TimeSheets[idx], ...body };
    const r = entrySchema.safeParse(merged);
    if (!r.success) throw new ValidationError("Invalid entry data", extractErrors(r.error));

    TimeSheets[idx] = r.data;
    return ok(TimeSheets[idx]);
  } catch (e) {
    return fail(e as Error);
  }
}

/** DELETE /api/timesheets/[id]/entries/[entryId] */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  try {
    const { id, entryId } = await params;
    const idx = TimeSheets.findIndex((e) => e.id === entryId && e.wId === id);
    if (idx === -1) return notFound("Entry not found");
    TimeSheets.splice(idx, 1);
    return ok({ deleted: true });
  } catch (e) {
    return fail(e as Error);
  }
}
