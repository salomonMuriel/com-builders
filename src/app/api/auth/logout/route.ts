import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await destroySession(token);
    cookieStore.delete("session_token");
  }

  return NextResponse.json({ ok: true });
}
