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
    {
      key: "pending_payment",
      label: "Unpaid",
      value: pending,
      tone: "warn" as const,
    },
    {
      key: "pending",
      label: "Unconfirmed",
      value: unconfirmed,
      tone: "warn" as const,
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      tone: "good" as const,
    },
  ];

  const toneText: Record<string, string> = {
    neutral: "text-white",
    warn: "text-amber-300",
    good: "text-emerald-300",
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
                className={`text-left rounded-2xl p-3 md:p-4 border transition-all duration-200 min-h-[64px] ${
                  active
                    ? "bg-[#FF6633]/15 border-[#FF6633]/50 shadow-lg shadow-[#FF6633]/10"
                    : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/45 truncate">
                  {t.label}
                </div>
                <div
                  className={`text-2xl md:text-3xl font-bold tabular-nums mt-1 ${
                    active ? "text-[#FF6633]" : toneText[t.tone]
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
