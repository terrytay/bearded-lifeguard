"use client";

import { useState } from "react";
import {
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ReportQueryFilters,
  FilterOption,
  BOOKING_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "@/lib/report-types";

interface FilterPanelProps {
  filters: ReportQueryFilters;
  onChange: (filters: ReportQueryFilters) => void;
}

type FilterKey = "status" | "paymentStatus" | "serviceType";

// Editorial active-state colour per value; inactive chips share one muted look.
const VALUE_ACTIVE_CLASS: Record<string, string> = {
  paid: "bg-sea/15 text-sea border-sea/45",
  pending: "bg-ochre/15 text-ochre border-ochre/45",
  confirmed: "bg-sea/15 text-sea border-sea/45",
  completed: "bg-ink text-paper border-ink",
  cancelled: "bg-signal/15 text-signal border-signal/45",
  refunded: "bg-signal/15 text-signal border-signal/45",
};

function chipClass(value: string, active: boolean, isService: boolean) {
  if (!active) {
    return "text-ink-soft border-ink/20 hover:border-ink/50 hover:text-ink";
  }
  return isService
    ? "bg-ink text-paper border-ink"
    : VALUE_ACTIVE_CLASS[value] || "bg-ink text-paper border-ink";
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const status = filters.status || [];
  const paymentStatus = filters.paymentStatus || [];
  const serviceType = filters.serviceType || [];
  const activeCount = status.length + paymentStatus.length + serviceType.length;

  const toggleValue = (key: FilterKey, value: string) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () =>
    onChange({ status: [], paymentStatus: [], serviceType: [] });

  const renderGroup = (
    title: string,
    key: FilterKey,
    options: FilterOption[],
    isService = false
  ) => {
    const selected = filters[key] || [];
    return (
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleValue(key, opt.value)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all min-h-[36px] ${chipClass(
                  opt.value,
                  active,
                  isService
                )}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-ink/12 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-sand/40 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FunnelIcon className="w-4 h-4 text-ink-soft" />
          <span className="text-sm font-semibold text-ink">Filters</span>
          {activeCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] tabular-nums bg-signal text-white font-semibold">
              {activeCount}
            </span>
          ) : (
            <span className="text-ink-soft/70 text-xs hidden sm:inline">
              All records
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {activeCount > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  clearAll();
                }
              }}
              className="text-xs text-ink-soft hover:text-ink underline-offset-2 hover:underline cursor-pointer"
            >
              Clear all
            </span>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-ink-soft transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Collapsed active chips */}
      {!open && activeCount > 0 && (
        <div className="px-4 pb-3.5 flex flex-wrap gap-1.5">
          {(
            [
              ["status", status],
              ["paymentStatus", paymentStatus],
              ["serviceType", serviceType],
            ] as [FilterKey, string[]][]
          ).flatMap(([key, vals]) =>
            vals.map((v) => {
              const opts =
                key === "status"
                  ? BOOKING_STATUS_OPTIONS
                  : key === "paymentStatus"
                  ? PAYMENT_STATUS_OPTIONS
                  : SERVICE_TYPE_OPTIONS;
              const label = opts.find((o) => o.value === v)?.label || v;
              return (
                <button
                  key={`${key}-${v}`}
                  type="button"
                  onClick={() => toggleValue(key, v)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border flex items-center gap-1 ${chipClass(
                    v,
                    true,
                    key === "serviceType"
                  )}`}
                >
                  {label}
                  <XMarkIcon className="w-3 h-3 opacity-70" />
                </button>
              );
            })
          )}
        </div>
      )}

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-ink/12">
          {renderGroup("Booking status", "status", BOOKING_STATUS_OPTIONS)}
          {renderGroup("Payment status", "paymentStatus", PAYMENT_STATUS_OPTIONS)}
          {renderGroup("Service type", "serviceType", SERVICE_TYPE_OPTIONS, true)}
          <p className="text-[11px] text-ink-soft leading-relaxed">
            No selection in a group = include all. Filters apply to the report,
            the payroll totals, and exports.
          </p>
        </div>
      )}
    </div>
  );
}
