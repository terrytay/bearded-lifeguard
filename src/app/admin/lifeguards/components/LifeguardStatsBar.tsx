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
    {
      key: "inactive",
      label: "Inactive",
      value: inactive,
      tone: "bad" as const,
    },
    {
      key: null,
      label: "Assigned",
      value: assigned,
      tone: "accent" as const,
    },
  ];

  const toneText: Record<string, string> = {
    neutral: "text-white",
    good: "text-emerald-300",
    bad: "text-rose-300",
    accent: "text-[#FF6633]",
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
                className={`text-left rounded-2xl p-3 md:p-4 border transition-all duration-200 min-h-[64px] ${
                  activeTile
                    ? "bg-[#FF6633]/15 border-[#FF6633]/50 shadow-lg shadow-[#FF6633]/10"
                    : "bg-white/[0.04] border-white/10"
                } ${clickable ? "hover:border-white/25 hover:bg-white/[0.06]" : ""}`}
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/45 truncate">
                  {t.label}
                </div>
                <div
                  className={`text-2xl md:text-3xl font-bold tabular-nums mt-1 ${
                    activeTile ? "text-[#FF6633]" : toneText[t.tone]
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
