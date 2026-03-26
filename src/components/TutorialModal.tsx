"use client";

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido a Unconference! 🎉</h2>

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

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)]
            text-white font-semibold text-lg transition-colors cursor-pointer"
        >
          ¡Entendido! 🚀
        </button>
      </div>
    </div>
  );
}
