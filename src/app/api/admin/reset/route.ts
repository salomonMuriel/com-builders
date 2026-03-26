import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST() {
  const user = await getSession();
  if (!user || !user.is_admin) {
    return NextResponse.json({ error: "Se requiere acceso de administrador" }, { status: 403 });
  }

  const sql = getDb();
  await sql`DELETE FROM votes`;
  await sql`DELETE FROM topics`;
  await sql`DELETE FROM users WHERE id != ${user.id}`;
  await sql`UPDATE app_state SET current_phase = 'submission'`;

  return NextResponse.json({ ok: true });
}
