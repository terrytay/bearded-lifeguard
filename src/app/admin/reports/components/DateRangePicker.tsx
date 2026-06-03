"use client";

import { useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
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

  const activePreset = presets.find(
    (p) =>
      formatDateForInput(p.startDate) === formatDateForInput(startDate) &&
      formatDateForInput(p.endDate) === formatDateForInput(endDate)
  )?.value;

  const handleCustomDateChange = (field: "start" | "end", value: string) => {
    if (!value) return;
    const newDate = new Date(value);
    if (field === "start") onDateRangeChange(newDate, endDate);
    else onDateRangeChange(startDate, newDate);
  };

  const dayCount = Math.max(
    1,
    Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
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

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-ink/20 rounded-lg text-ink text-sm focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all min-h-[44px] [color-scheme:light]";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Period
          </div>
          <div className="font-display text-base font-semibold text-ink truncate leading-tight">
            {rangeLabel}
          </div>
          <div className="text-[11px] text-ink-soft tabular-nums">
            {dayCount} {dayCount === 1 ? "day" : "days"}
            {activePreset
              ? ` · ${presets.find((p) => p.value === activePreset)?.label}`
              : " · custom"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCustomOpen((o) => !o)}
          aria-pressed={customOpen}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all min-h-[40px] flex-shrink-0 ${
            customOpen
              ? "bg-ink text-paper border-ink"
              : "text-ink-soft border-ink/20 hover:text-ink hover:border-ink/50"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Custom</span>
        </button>
      </div>

      {/* Preset chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5">
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
              className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-medium border transition-all min-h-[40px] flex-shrink-0 ${
                active
                  ? "bg-ink text-paper border-ink"
                  : "text-ink-soft border-ink/20 hover:text-ink hover:border-ink/50"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {customOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Start date
            </span>
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              max={formatDateForInput(endDate)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              End date
            </span>
            <input
              type="date"
              value={formatDateForInput(endDate)}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              min={formatDateForInput(startDate)}
              max={formatDateForInput(new Date())}
              className={inputClass}
            />
          </label>
        </div>
      )}
    </div>
  );
}
