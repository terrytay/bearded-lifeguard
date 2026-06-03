"use client";

import { useState } from "react";
import {
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { getDateRangePresets } from "@/lib/report-types";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

// Local (Singapore) calendar components — NOT toISOString(), which would shift
// local midnight to the previous UTC day (the 1-day-behind bug).
const formatDateForInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const presets = getDateRangePresets();

  // Best-effort active-preset detection by comparing the rendered day strings,
  // so the matching chip highlights even on first load.
  const activePreset = presets.find(
    (p) =>
      formatDateForInput(p.startDate) === formatDateForInput(startDate) &&
      formatDateForInput(p.endDate) === formatDateForInput(endDate)
  )?.value;

  const handleCustomDateChange = (field: "start" | "end", value: string) => {
    if (!value) return;
    const newDate = new Date(value);
    if (field === "start") {
      onDateRangeChange(newDate, endDate);
    } else {
      onDateRangeChange(startDate, newDate);
    }
  };

  const dayCount = Math.max(
    1,
    Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const rangeLabel = `${startDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })} → ${endDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center flex-shrink-0">
            <CalendarDaysIcon className="w-3.5 h-3.5 text-sky-300" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {rangeLabel}
            </div>
            <div className="text-[11px] text-white/40 tabular-nums">
              {dayCount} {dayCount === 1 ? "day" : "days"}
              {activePreset
                ? ` · ${presets.find((p) => p.value === activePreset)?.label}`
                : " · custom"}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCustomOpen((o) => !o)}
          aria-pressed={customOpen}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all min-h-[40px] flex-shrink-0 ${
            customOpen
              ? "bg-[#FF6633]/20 text-orange-200 border-[#FF6633]/40"
              : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:border-white/25"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Custom</span>
        </button>
      </div>

      {/* Preset chips — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5 snap-x">
        {presets.map((preset) => {
          const active = activePreset === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                setCustomOpen(false);
                onDateRangeChange(preset.startDate, preset.endDate);
              }}
              className={`whitespace-nowrap snap-start px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-150 min-h-[40px] flex-shrink-0 ${
                active
                  ? "bg-[#FF6633] text-white border-[#FF6633] shadow-lg shadow-[#FF6633]/20"
                  : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:border-white/25"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom range inputs */}
      {customOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Start date
            </span>
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              max={formatDateForInput(endDate)}
              className="w-full px-3 py-2.5 bg-black/20 border border-white/15 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#FF6633]/40 focus:border-[#FF6633]/50 transition-all min-h-[44px] [color-scheme:dark]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              End date
            </span>
            <input
              type="date"
              value={formatDateForInput(endDate)}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              min={formatDateForInput(startDate)}
              max={formatDateForInput(new Date())}
              className="w-full px-3 py-2.5 bg-black/20 border border-white/15 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#FF6633]/40 focus:border-[#FF6633]/50 transition-all min-h-[44px] [color-scheme:dark]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
