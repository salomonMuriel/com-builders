"use client";

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
}

interface TopicCardProps {
  topic: Topic;
  phase: "submission" | "voting";
  currentUserId: string;
  isVoted: boolean;
  onClaim: () => void;
  onVote: () => void;
  rank?: number;
}

export function TopicCard({ topic, phase, currentUserId, isVoted, onClaim, onVote, rank }: TopicCardProps) {
  if (phase === "voting") {
    return (
      <div className="topic-card flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
        hover:bg-[var(--bg-card-hover)] transition-colors">
        {/* Rank */}
        {rank !== undefined && (
          <div className={`text-2xl sm:text-4xl font-bold w-8 sm:w-14 text-center shrink-0 ${
            rank === 1 ? "text-[var(--orange)]" : rank === 2 ? "text-gray-300" : rank === 3 ? "text-amber-600" : "text-[var(--text-muted)]"
          }`}>
            {rank}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-xl leading-snug text-[var(--text)]">{topic.title}</h3>
          {topic.description && (
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-1 line-clamp-2">{topic.description}</p>
          )}
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-1.5">
            🎙️ <span className="text-[var(--text)] font-medium">{topic.speaker_name}</span>
          </p>
        </div>

        {/* Vote button - minimum 44px touch target */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={onVote}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              isVoted
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--accent)]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm sm:text-base font-bold">{topic.vote_count}</span>
          </button>
        </div>
      </div>
    );
  }

  // Submission phase card
  return (
    <div className="topic-card p-3 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
      hover:bg-[var(--bg-card-hover)] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base sm:text-xl leading-snug text-[var(--text)]">{topic.title}</h3>
          {topic.description && (
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-1">{topic.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm sm:text-base text-[var(--text-muted)]">
            <span>por <span className="text-[var(--text)]">{topic.proposed_by_name}</span></span>
            {topic.speaker_name && topic.type === "speaker_led" && (
              <span className="text-[var(--green)]">🎙️ <span className="font-medium">{topic.speaker_name}</span></span>
            )}
          </div>
        </div>

        {/* Claim button for orphan topics - min 44px height touch target */}
        {topic.type === "orphan" && topic.proposed_by !== currentUserId && (
          <button
            onClick={onClaim}
            className="px-3 sm:px-4 py-2.5 rounded-lg bg-[var(--green)]/15 text-[var(--green)]
              hover:bg-[var(--green)]/25 font-medium text-sm transition-colors shrink-0 cursor-pointer
              min-h-[44px] flex items-center"
          >
            ¡La doy yo! 🙌
          </button>
        )}
      </div>
    </div>
  );
}
