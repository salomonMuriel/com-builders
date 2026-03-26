"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TopicCard } from "@/components/TopicCard";
import { NewTopicModal } from "@/components/NewTopicModal";
import { TutorialModal } from "@/components/TutorialModal";

interface User {
  id: string;
  name: string;
  is_admin: boolean;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  type: "speaker_led" | "orphan";
  proposed_by: string;
  proposed_by_name: string;
  speaker_id: string | null;
  speaker_name: string | null;
  vote_count: number;
  created_at: string;
}

type ModalType = "pitch" | "request" | null;

export default function BoardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [phase, setPhase] = useState<"submission" | "voting">("submission");
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [userRes, topicsRes, phaseRes, votesRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/topics"),
        fetch("/api/phase"),
        fetch("/api/my-votes"),
      ]);

      if (!userRes.ok) {
        router.push("/");
        return;
      }

      const userData = await userRes.json();
      const topicsData = await topicsRes.json();
      const phaseData = await phaseRes.json();
      const votesData = await votesRes.json();

      setUser(userData.user);
      setTopics(topicsData.topics);
      setPhase(phaseData.phase);
      setMyVotes(new Set(votesData.votes));
    } catch {
      // Silently retry on next poll
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (localStorage.getItem("show_tutorial") === "1") {
      localStorage.removeItem("show_tutorial");
      setShowTutorial(true);
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function handleAdvancePhase() {
    await fetch("/api/phase/advance", { method: "POST" });
    fetchData();
  }

  async function handleReset() {
    if (!confirm("¿Estás seguro? Esto borra todos los temas, votos y usuarios (excepto el tuyo).")) return;
    await fetch("/api/admin/reset", { method: "POST" });
    fetchData();
  }

  async function handleClaim(topicId: string) {
    await fetch(`/api/topics/${topicId}/claim`, { method: "POST" });
    fetchData();
  }

  async function handleVote(topicId: string) {
    // Optimistic update
    setMyVotes((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });

    await fetch(`/api/topics/${topicId}/vote`, { method: "POST" });
    fetchData();
  }

  async function handleCreateTopic(title: string, description: string, type: "speaker_led" | "orphan") {
    await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type }),
    });
    setModalOpen(null);
    fetchData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)] text-xl">Cargando... ⏳</div>
      </div>
    );
  }

  const orphanTopics = topics.filter((t) => t.type === "orphan");
  const speakerTopics = topics.filter((t) => t.type === "speaker_led");
  const sortedByVotes = [...topics]
    .filter((t) => t.speaker_id)
    .sort((a, b) => b.vote_count - a.vote_count);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 sm:px-6 py-3 sm:py-4 shrink-0">
        {/* Top row: title + phase badge + user/logout */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold shrink-0">🎤 Unconference</h1>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shrink-0 ${
                phase === "submission"
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "bg-[var(--green)]/20 text-[var(--green)]"
              }`}
            >
              {phase === "submission" ? "📝 Propuestas" : "🗳️ Votación"}
            </span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)] shrink-0">
            <span className="text-[var(--text-muted)] text-sm hidden sm:inline truncate max-w-[120px]">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-[var(--text-muted)] hover:text-[var(--red)] text-sm transition-colors cursor-pointer py-2 px-1"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Action buttons row - only shown during submission phase */}
        {phase === "submission" && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setModalOpen("pitch")}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                text-white font-medium transition-colors cursor-pointer text-sm sm:text-base text-center"
            >
              Proponer charla 💡
            </button>
            <button
              onClick={() => setModalOpen("request")}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]
                hover:bg-[var(--bg-card-hover)] font-medium transition-colors cursor-pointer text-sm sm:text-base text-center"
            >
              Pedir charla 🙋
            </button>
            {user?.is_admin && (
              <>
                <button
                  onClick={handleAdvancePhase}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--orange)]/20 text-[var(--orange)]
                    hover:bg-[var(--orange)]/30 font-medium transition-colors cursor-pointer text-sm sm:text-base text-center"
                >
                  Iniciar votación 🗳️
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--red)]/20 text-[var(--red)]
                    hover:bg-[var(--red)]/30 font-medium transition-colors cursor-pointer text-sm sm:text-base text-center"
                >
                  Reiniciar todo 🗑️
                </button>
              </>
            )}
          </div>
        )}

        {/* Admin buttons during voting phase */}
        {phase === "voting" && user?.is_admin && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={handleAdvancePhase}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--orange)]/20 text-[var(--orange)]
                hover:bg-[var(--orange)]/30 font-medium transition-colors cursor-pointer text-sm text-center"
            >
              Volver a propuestas 📝
            </button>
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[var(--red)]/20 text-[var(--red)]
                hover:bg-[var(--red)]/30 font-medium transition-colors cursor-pointer text-sm text-center"
            >
              Reiniciar todo 🗑️
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      {phase === "submission" ? (
        /* On mobile: single scrollable column with sections stacked.
           On desktop (lg+): side-by-side split with independent scroll per column. */
        <>
          {/* Mobile layout: stacked sections, single scroll */}
          <div className="lg:hidden flex-1 overflow-y-auto p-4 space-y-6">
            {/* Orphan Topics Section */}
            <div>
              <div className="mb-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--orange)] shrink-0" />
                  Temas solicitados 🔎
                  <span className="text-[var(--text-muted)] font-normal text-sm">
                    ({orphanTopics.length})
                  </span>
                </h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 ml-5">
                  Ideas buscando un speaker — ¡reclama una para presentar!
                </p>
              </div>
              <div className="space-y-3">
                {orphanTopics.length === 0 ? (
                  <div className="text-center text-[var(--text-muted)] py-8 text-sm">
                    Aún no hay temas solicitados
                  </div>
                ) : (
                  orphanTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      phase={phase}
                      currentUserId={user?.id || ""}
                      isVoted={false}
                      onClaim={() => handleClaim(topic.id)}
                      onVote={() => {}}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-[var(--border)]" />

            {/* Speaker-Led Topics Section */}
            <div>
              <div className="mb-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--green)] shrink-0" />
                  Charlas con speaker 🎙️
                  <span className="text-[var(--text-muted)] font-normal text-sm">
                    ({speakerTopics.length})
                  </span>
                </h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 ml-5">
                  Charlas con speaker confirmado
                </p>
              </div>
              <div className="space-y-3">
                {speakerTopics.length === 0 ? (
                  <div className="text-center text-[var(--text-muted)] py-8 text-sm">
                    Aún no hay charlas con speaker
                  </div>
                ) : (
                  speakerTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      phase={phase}
                      currentUserId={user?.id || ""}
                      isVoted={false}
                      onClaim={() => {}}
                      onVote={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Desktop layout: side-by-side columns with independent scroll */}
          <div className="hidden lg:flex flex-1 divide-x divide-[var(--border)] overflow-hidden">
            {/* Left Column - Orphan Topics */}
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-[var(--border)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <span className="w-3 h-3 rounded-full bg-[var(--orange)]" />
                  Temas solicitados 🔎
                  <span className="text-[var(--text-muted)] font-normal text-base ml-1">
                    ({orphanTopics.length})
                  </span>
                </h2>
                <p className="text-[var(--text-muted)] text-base mt-1">
                  Ideas buscando un speaker — ¡reclama una para presentar!
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {orphanTopics.length === 0 ? (
                  <div className="text-center text-[var(--text-muted)] py-12">
                    Aún no hay temas solicitados
                  </div>
                ) : (
                  orphanTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      phase={phase}
                      currentUserId={user?.id || ""}
                      isVoted={false}
                      onClaim={() => handleClaim(topic.id)}
                      onVote={() => {}}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Speaker-Led Topics */}
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-[var(--border)] shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <span className="w-3 h-3 rounded-full bg-[var(--green)]" />
                  Charlas con speaker 🎙️
                  <span className="text-[var(--text-muted)] font-normal text-base ml-1">
                    ({speakerTopics.length})
                  </span>
                </h2>
                <p className="text-[var(--text-muted)] text-base mt-1">
                  Charlas con speaker confirmado
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {speakerTopics.length === 0 ? (
                  <div className="text-center text-[var(--text-muted)] py-12">
                    Aún no hay charlas con speaker
                  </div>
                ) : (
                  speakerTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      phase={phase}
                      currentUserId={user?.id || ""}
                      isVoted={false}
                      onClaim={() => {}}
                      onVote={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Voting Phase - Leaderboard */
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-3">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-1 text-white">¡Vota por las sesiones! 🔥</h2>
              <p className="text-[var(--text-muted)] text-sm sm:text-lg">
                Elige las charlas que quieres ver. Se ordenan por votos en tiempo real.
              </p>
            </div>

            {sortedByVotes.length === 0 ? (
              <div className="text-center text-[var(--text-muted)] py-12">
                No hay temas con speaker disponibles para votar
              </div>
            ) : (
              sortedByVotes.map((topic, index) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  phase={phase}
                  currentUserId={user?.id || ""}
                  isVoted={myVotes.has(topic.id)}
                  onClaim={() => {}}
                  onVote={() => handleVote(topic.id)}
                  rank={index + 1}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <NewTopicModal
          type={modalOpen}
          onClose={() => setModalOpen(null)}
          onSubmit={handleCreateTopic}
        />
      )}

      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
