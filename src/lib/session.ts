import { cookies } from "next/headers";
import { getDb } from "./db";

export interface SessionUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT id, name, is_admin FROM users WHERE session_token = ${token}
  `;

  if (rows.length === 0) return null;
  return rows[0] as SessionUser;
}

const ADMIN_NAMES = ["luis betancourt", "salomón muriel", "salomon muriel"];

export async function createSession(name: string): Promise<{ user: SessionUser; token: string }> {
  const sql = getDb();
  const normalized = name.trim().toLowerCase();
  const isAdmin = ADMIN_NAMES.includes(normalized);
  const token = crypto.randomUUID();

  if (isAdmin) {
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(name) = ${normalized}
    `;
    if (existing.length > 0) {
      throw new Error(`${name.trim()} ya está conectado`);
    }
  }

  const rows = await sql`
    INSERT INTO users (name, is_admin, session_token)
    VALUES (${name.trim()}, ${isAdmin}, ${token})
    RETURNING id, name, is_admin
  `;

  return { user: rows[0] as SessionUser, token };
}

export async function destroySession(token: string) {
  const sql = getDb();
  await sql`DELETE FROM users WHERE session_token = ${token}`;
}
