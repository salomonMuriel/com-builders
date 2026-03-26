"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo ingresar");
        return;
      }

      localStorage.setItem("show_tutorial", "1");
      router.push("/board");
    } catch {
      setError("Algo salió mal, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">🎤 Unconference</h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg">Ingresa con tu nombre para empezar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            autoFocus
            className="w-full px-5 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-base sm:text-lg
              placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
              transition-colors"
          />

          {error && (
            <p className="text-[var(--red)] text-sm px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)]
              disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base sm:text-lg
              transition-colors cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar 🚀"}
          </button>
        </form>

        {/* QR code: only useful on desktop where users aren't already on their phone */}
        <div className="hidden sm:flex mt-10 flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-xl">
            <QRCodeSVG
              value="https://com-builders.vercel.app"
              size={160}
              level="M"
            />
          </div>
          <p className="text-[var(--text-muted)] text-sm">Escanea para unirte desde tu celular 📱</p>
        </div>
      </div>
    </div>
  );
}
