import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "El nombre es muy largo" }, { status: 400 });
  }

  try {
    const { user, token } = await createSession(name);
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ user });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "No se pudo ingresar";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
