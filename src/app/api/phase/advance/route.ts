import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST() {
  const user = await getSession();
  if (!user || !user.is_admin) {
    return NextResponse.json({ error: "Se requiere acceso de administrador" }, { status: 403 });
  }

  const sql = getDb();
  const rows = await sql`SELECT current_phase FROM app_state WHERE id = 1`;
  const current = rows[0]?.current_phase;

  if (current === "submission") {
    await sql`UPDATE app_state SET current_phase = 'voting' WHERE id = 1`;
    return NextResponse.json({ phase: "voting" });
  } else if (current === "voting") {
    await sql`UPDATE app_state SET current_phase = 'submission' WHERE id = 1`;
    return NextResponse.json({ phase: "submission" });
  }

  return NextResponse.json({ error: "Fase inválida" }, { status: 400 });
}
