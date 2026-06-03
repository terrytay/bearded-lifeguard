"use client";

import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { ReportType } from "@/lib/report-types";

interface ReportTypeSelectorProps {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
}

const TYPES: { type: ReportType; label: string; icon: typeof CalendarDaysIcon }[] =
  [
    { type: "bookings", label: "Bookings", icon: CalendarDaysIcon },
    { type: "lifeguards", label: "Lifeguards", icon: UserGroupIcon },
  ];

export default function ReportTypeSelector({
  reportType,
  onReportTypeChange,
}: ReportTypeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Report type"
      className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/20 border border-white/10"
    >
      {TYPES.map(({ type, label, icon: Icon }) => {
        const active = reportType === type;
        return (
          <button
            key={type}
            role="tab"
            aria-selected={active}
            onClick={() => onReportTypeChange(type)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] transition-all duration-200 ${
              active
                ? "bg-[#FF6633] text-white shadow-lg shadow-[#FF6633]/20"
                : "text-white/55 hover:text-white hover:bg-white/5"
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
