"use client";

import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { ReportType } from "@/lib/report-types";

const TYPES: { type: ReportType; label: string; icon: typeof CalendarDaysIcon }[] =
  [
    { type: "bookings", label: "Bookings", icon: CalendarDaysIcon },
    { type: "lifeguards", label: "Lifeguards", icon: UserGroupIcon },
  ];

export default function ReportTypeSelector({
  reportType,
  onReportTypeChange,
}: {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Report type"
      className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-sand/60 border border-ink/12"
    >
      {TYPES.map(({ type, label, icon: Icon }) => {
        const active = reportType === type;
        return (
          <button
            key={type}
            role="tab"
            aria-selected={active}
            onClick={() => onReportTypeChange(type)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] transition-all ${
              active
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink hover:bg-ink/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
