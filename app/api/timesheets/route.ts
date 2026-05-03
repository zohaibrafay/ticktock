import { NextRequest } from "next/server";
import { weekSchema, extractErrors } from "@/lib/schemas";
import { ok, fail } from "@/lib/api-helpers";
import { ValidationError } from "@/lib/errors";
import { Weeks } from "@/data/mock-timesheets";

/** GET /api/timesheets — all weeks */
export async function GET() {
  try {
    const validated = Weeks.map((w) => {
      const r = weekSchema.safeParse(w);
      if (!r.success) throw new ValidationError("Invalid week in store", extractErrors(r.error));
      return r.data;
    });
    return ok(validated);
  } catch (e) {
    return fail(e as Error);
  }
}

/** POST /api/timesheets — create week */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = weekSchema.omit({ id: true }).safeParse(body);
    if (!r.success) throw new ValidationError("Invalid week data", extractErrors(r.error));

    const week = { id: `w${Date.now()}`, ...r.data };
    Weeks.push(week);
    return ok(week, 201);
  } catch (e) {
    return fail(e as Error);
  }
}
