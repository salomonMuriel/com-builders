import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ votes: [] });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT topic_id FROM votes WHERE user_id = ${user.id}
  `;

  return NextResponse.json({ votes: rows.map((r) => r.topic_id) });
}
