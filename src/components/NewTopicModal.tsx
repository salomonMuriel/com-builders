"use client";

import { useState } from "react";

interface NewTopicModalProps {
  type: "pitch" | "request";
  onClose: () => void;
  onSubmit: (title: string, description: string, type: "speaker_led" | "orphan") => void;
}

export function NewTopicModal({ type, onClose, onSubmit }: NewTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isPitch = type === "pitch";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, description, isPitch ? "speaker_led" : "orphan");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal - slides up from bottom on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-lg sm:mx-4 p-5 sm:p-6 rounded-t-2xl sm:rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
        {/* Drag handle hint on mobile */}
        <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4 sm:hidden" />

        <h2 className="text-xl font-bold mb-1">
          {isPitch ? "Proponer charla 💡" : "Pedir charla 🙋"}
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-5">
          {isPitch
            ? "Propón un tema que quieras presentar"
            : "Sugiere un tema que te gustaría que alguien cubra"
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isPitch ? "¿De qué vas a hablar?" : "¿Qué te gustaría aprender?"}
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]
                placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
                transition-colors text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agrega más detalles..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]
                placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
                transition-colors resize-none text-base"
            />
          </div>

          {/* Buttons: stacked on mobile, inline on desktop */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-lg text-[var(--text-muted)]
                hover:text-[var(--text)] transition-colors cursor-pointer text-center border
                border-[var(--border)] sm:border-transparent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-lg font-medium text-white
                transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center ${
                  isPitch
                    ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
                    : "bg-[var(--orange)] hover:brightness-110"
                }`}
            >
              {isPitch ? "¡Proponerla!" : "¡Pedirla!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
