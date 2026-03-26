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

  // Check we're in voting phase
  const phase = await sql`SELECT current_phase FROM app_state WHERE id = 1`;
  if (phase[0]?.current_phase !== "voting") {
    return NextResponse.json({ error: "La votación no está abierta" }, { status: 403 });
  }

  // Only allow voting on topics that have a speaker
  const topic = await sql`SELECT id, speaker_id FROM topics WHERE id = ${id}`;
  if (topic.length === 0) {
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  }
  if (!topic[0].speaker_id) {
    return NextResponse.json({ error: "No se puede votar por temas sin speaker" }, { status: 400 });
  }

  // Toggle vote
  const existing = await sql`
    SELECT id FROM votes WHERE user_id = ${user.id} AND topic_id = ${id}
  `;

  if (existing.length > 0) {
    await sql`DELETE FROM votes WHERE user_id = ${user.id} AND topic_id = ${id}`;
    return NextResponse.json({ voted: false });
  } else {
    await sql`INSERT INTO votes (user_id, topic_id) VALUES (${user.id}, ${id})`;
    return NextResponse.json({ voted: true });
  }
}
