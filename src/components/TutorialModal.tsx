"use client";

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl
        max-h-[90dvh] flex flex-col">
        {/* Drag handle hint on mobile */}
        <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mt-4 sm:hidden shrink-0" />

        {/* Scrollable content area */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">¡Bienvenido a Unconference! 🎉</h2>

          <div className="space-y-4 text-[var(--text)]">
            <div className="flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <h3 className="font-semibold">Proponer charla</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  ¿Tienes algo que compartir? Propón un tema y tú serás el speaker.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl shrink-0">🙋</span>
              <div>
                <h3 className="font-semibold">Pedir charla</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  ¿Quieres aprender sobre algo? Sugiere un tema y alguien más puede tomarlo.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl shrink-0">🙌</span>
              <div>
                <h3 className="font-semibold">Reclamar un tema</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  ¿Ves un tema pedido que dominas? Reclámalo y conviértete en su speaker.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl shrink-0">🗳️</span>
              <div>
                <h3 className="font-semibold">Votar</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Cuando se abra la votación, elige las charlas que más te interesan. Las más votadas se programan primero.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer button */}
        <div className="p-4 sm:p-6 pt-0 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)]
              text-white font-semibold text-base sm:text-lg transition-colors cursor-pointer"
          >
            ¡Entendido! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
