import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const sql = getDb();

  // Check we're in submission phase
  const phase = await sql`SELECT current_phase FROM app_state WHERE id = 1`;
  if (phase[0]?.current_phase !== "submission") {
    return NextResponse.json({ error: "Las propuestas están cerradas" }, { status: 403 });
  }

  // Claim the topic (only if orphan and unclaimed)
  const rows = await sql`
    UPDATE topics
    SET speaker_id = ${user.id}, type = 'speaker_led'
    WHERE id = ${id} AND type = 'orphan' AND speaker_id IS NULL
    RETURNING id
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Este tema ya no está disponible para reclamar" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
