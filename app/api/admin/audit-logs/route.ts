import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_KEY } from "@/lib/admin-auth";

const ALLOWED_TABLES = ["stories", "events", "event_info", "stamps"] as const;
const ALLOWED_ACTIONS = ["INSERT", "UPDATE", "DELETE"] as const;
const MAX_PAGE_SIZE = 200;

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const table = sp.get("table");
  const action = sp.get("action");
  const from = sp.get("from");
  const to = sp.get("to");
  const rowId = sp.get("row_id");
  const page = Math.max(1, Number(sp.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(sp.get("pageSize") ?? "50") || 50)
  );

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server misconfigured" },
      { status: 500 }
    );
  }

  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("changed_at", { ascending: false });

  if (table && (ALLOWED_TABLES as readonly string[]).includes(table)) {
    query = query.eq("table_name", table);
  }
  if (action && (ALLOWED_ACTIONS as readonly string[]).includes(action)) {
    query = query.eq("action", action);
  }
  if (rowId) query = query.eq("row_id", rowId);
  if (from) query = query.gte("changed_at", from);
  if (to) query = query.lte("changed_at", to);

  const fromIdx = (page - 1) * pageSize;
  query = query.range(fromIdx, fromIdx + pageSize - 1);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
}
