import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT current_phase FROM app_state WHERE id = 1`;
  return NextResponse.json({ phase: rows[0]?.current_phase || "submission" });
}
