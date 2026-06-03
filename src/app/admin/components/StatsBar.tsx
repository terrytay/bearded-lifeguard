"use client";

interface StatsBarProps {
  total: number;
  paid: number;
  pending: number;
  unconfirmed: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  newCount: number;
  filterStatus?: string;
  onFilterChange?: (status: string) => void;
}

export default function StatsBar({
  total,
  pending,
  unconfirmed,
  completed,
  filterStatus = "all",
  onFilterChange,
}: StatsBarProps) {
  const tiles = [
    { key: "all", label: "Total", value: total, tone: "neutral" as const },
    { key: "pending_payment", label: "Unpaid", value: pending, tone: "warn" as const },
    { key: "pending", label: "Unconfirmed", value: unconfirmed, tone: "warn" as const },
    { key: "completed", label: "Completed", value: completed, tone: "good" as const },
  ];

  const toneText: Record<string, string> = {
    neutral: "text-ink",
    warn: "text-ochre",
    good: "text-sea",
  };

  return (
    <div className="px-3 md:px-6 pt-3 md:pt-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-4">
          {tiles.map((t) => {
            const active = filterStatus === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onFilterChange?.(active ? "all" : t.key)}
                className={`text-left rounded-2xl p-3 md:p-4 border transition-all min-h-[72px] ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "bg-white border-ink/12 hover:border-ink/40"
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.16em] truncate ${
                    active ? "text-paper/60" : "text-ink-soft"
                  }`}
                >
                  {t.label}
                </div>
                <div
                  className={`font-display text-3xl md:text-4xl font-semibold tabular-nums leading-none mt-1.5 ${
                    active ? "text-paper" : toneText[t.tone]
                  }`}
                >
                  {t.value}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
