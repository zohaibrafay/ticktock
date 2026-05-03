import { NextRequest } from "next/server";
import { weekSchema, extractErrors } from "@/lib/schemas";
import { ok, fail, notFound } from "@/lib/api-helpers";
import { ValidationError } from "@/lib/errors";
import { Weeks } from "@/data/mock-timesheets";

/** PUT /api/timesheets/[id] — update week */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idx = Weeks.findIndex((w) => w.id === id);
    if (idx === -1) return notFound("Week not found");

    const body = await req.json();
    const merged = { ...Weeks[idx], ...body };
    const r = weekSchema.safeParse(merged);
    if (!r.success) throw new ValidationError("Invalid week data", extractErrors(r.error));

    Weeks[idx] = r.data;
    return ok(Weeks[idx]);
  } catch (e) {
    return fail(e as Error);
  }
}

/** DELETE /api/timesheets/[id] */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idx = Weeks.findIndex((w) => w.id === id);
    if (idx === -1) return notFound("Week not found");
    Weeks.splice(idx, 1);
    return ok({ deleted: true });
  } catch (e) {
    return fail(e as Error);
  }
}
