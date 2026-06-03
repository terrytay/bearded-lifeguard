"use client";

interface LifeguardStatsBarProps {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
  filterStatus?: string;
  onFilterChange?: (status: string) => void;
}

export default function LifeguardStatsBar({
  total,
  active,
  inactive,
  assigned,
  filterStatus = "all",
  onFilterChange,
}: LifeguardStatsBarProps) {
  const tiles = [
    { key: "all", label: "Total", value: total, tone: "neutral" as const },
    { key: "active", label: "Active", value: active, tone: "good" as const },
    { key: "inactive", label: "Inactive", value: inactive, tone: "bad" as const },
    { key: null, label: "Assigned", value: assigned, tone: "accent" as const },
  ];

  const toneText: Record<string, string> = {
    neutral: "text-ink",
    good: "text-sea",
    bad: "text-signal",
    accent: "text-signal",
  };

  return (
    <div className="px-3 md:px-6 pt-3 md:pt-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-4">
          {tiles.map((t) => {
            const clickable = t.key !== null && !!onFilterChange;
            const activeTile = t.key !== null && filterStatus === t.key;
            const Comp: any = clickable ? "button" : "div";
            return (
              <Comp
                key={t.label}
                {...(clickable
                  ? {
                      onClick: () =>
                        onFilterChange?.(activeTile ? "all" : (t.key as string)),
                    }
                  : {})}
                className={`text-left rounded-2xl p-3 md:p-4 border transition-all min-h-[72px] ${
                  activeTile
                    ? "bg-ink text-paper border-ink"
                    : "bg-white border-ink/12"
                } ${clickable ? "hover:border-ink/40" : ""}`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.16em] truncate ${
                    activeTile ? "text-paper/60" : "text-ink-soft"
                  }`}
                >
                  {t.label}
                </div>
                <div
                  className={`font-display text-3xl md:text-4xl font-semibold tabular-nums leading-none mt-1.5 ${
                    activeTile ? "text-paper" : toneText[t.tone]
                  }`}
                >
                  {t.value}
                </div>
              </Comp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
