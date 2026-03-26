import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unconference 🎤",
  description: "Plataforma liviana para unconferences",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
