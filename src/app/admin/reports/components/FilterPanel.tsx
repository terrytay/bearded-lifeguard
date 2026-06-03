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

// Active-state colour per status/payment value; inactive chips share one muted look.
const VALUE_ACTIVE_CLASS: Record<string, string> = {
  paid: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  pending: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  confirmed: "bg-sky-500/20 text-sky-200 border-sky-400/40",
  completed: "bg-violet-500/20 text-violet-200 border-violet-400/40",
  cancelled: "bg-rose-500/20 text-rose-200 border-rose-400/40",
  refunded: "bg-rose-500/20 text-rose-200 border-rose-400/40",
};

const SERVICE_ACTIVE_CLASS =
  "bg-[#FF6633]/20 text-orange-200 border-[#FF6633]/50";

function chipClass(value: string, active: boolean, isService: boolean) {
  if (!active) {
    return "bg-white/[0.04] text-white/55 border-white/10 hover:border-white/25 hover:text-white/80";
  }
  return isService
    ? SERVICE_ACTIVE_CLASS
    : VALUE_ACTIVE_CLASS[value] ||
        "bg-[#FF6633]/20 text-orange-200 border-[#FF6633]/50";
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

  const clearAll = () => {
    onChange({ status: [], paymentStatus: [], serviceType: [] });
  };

  const renderGroup = (
    title: string,
    key: FilterKey,
    options: FilterOption[],
    isService = false
  ) => {
    const selected = filters[key] || [];
    return (
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
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
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-150 min-h-[36px] ${chipClass(
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
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF6633]/15 border border-[#FF6633]/30 flex items-center justify-center flex-shrink-0">
            <FunnelIcon className="w-3.5 h-3.5 text-[#FF6633]" />
          </div>
          <span className="text-sm font-semibold text-white">Filters</span>
          {activeCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] tabular-nums bg-[#FF6633] text-white font-semibold">
              {activeCount}
            </span>
          ) : (
            <span className="text-white/35 text-xs hidden sm:inline">
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
              className="text-xs text-white/50 hover:text-white/90 underline-offset-2 hover:underline cursor-pointer"
            >
              Clear all
            </span>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Active chips summary when collapsed */}
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

      {/* Expanded body */}
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/10">
          {renderGroup("Booking status", "status", BOOKING_STATUS_OPTIONS)}
          {renderGroup("Payment status", "paymentStatus", PAYMENT_STATUS_OPTIONS)}
          {renderGroup("Service type", "serviceType", SERVICE_TYPE_OPTIONS, true)}
          <p className="text-[11px] text-white/35 leading-relaxed">
            No selection in a group = include all. Filters apply to the report,
            the payroll totals, and exports.
          </p>
        </div>
      )}
    </div>
  );
}
