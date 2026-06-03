"use client";

import { useState } from "react";
import {
  CheckIcon,
  Squares2X2Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  ReportType,
  BookingReportFields,
  LifeguardReportFields,
  BOOKING_FIELD_DEFINITIONS,
  LIFEGUARD_FIELD_DEFINITIONS,
  FieldDefinition,
} from "@/lib/report-types";

interface FieldSelectorProps {
  reportType: ReportType;
  bookingFields: BookingReportFields;
  lifeguardFields: LifeguardReportFields;
  onBookingFieldsChange: (fields: BookingReportFields) => void;
  onLifeguardFieldsChange: (fields: LifeguardReportFields) => void;
}

const GROUP_LABELS: Record<string, string> = {
  basic: "Basic",
  service: "Service",
  financial: "Financial",
  contact: "Contact",
  timestamps: "Timestamps",
  computed: "Computed",
};

export default function FieldSelector({
  reportType,
  bookingFields,
  lifeguardFields,
  onBookingFieldsChange,
  onLifeguardFieldsChange,
}: FieldSelectorProps) {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      basic: true,
      service: true,
      financial: true,
      contact: false,
      timestamps: false,
      computed: true,
    }
  );

  const currentFields =
    reportType === "bookings" ? bookingFields : lifeguardFields;
  const fieldDefinitions =
    reportType === "bookings"
      ? BOOKING_FIELD_DEFINITIONS
      : LIFEGUARD_FIELD_DEFINITIONS;

  const groupedFields = fieldDefinitions.reduce((acc, field) => {
    (acc[field.group] = acc[field.group] || []).push(field);
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  const selectedCount = Object.values(currentFields).filter(Boolean).length;
  const totalCount = fieldDefinitions.length;

  const handleFieldToggle = (fieldKey: string) => {
    if (reportType === "bookings") {
      onBookingFieldsChange({
        ...bookingFields,
        [fieldKey]: !bookingFields[fieldKey as keyof BookingReportFields],
      });
    } else {
      onLifeguardFieldsChange({
        ...lifeguardFields,
        [fieldKey]: !lifeguardFields[fieldKey as keyof LifeguardReportFields],
      });
    }
  };

  const setAll = (value: boolean) => {
    const next = Object.keys(currentFields).reduce((acc, key) => {
      acc[key] = value;
      return acc;
    }, {} as any);
    if (reportType === "bookings") onBookingFieldsChange(next);
    else onLifeguardFieldsChange(next);
  };

  const toggleGroup = (g: string) =>
    setExpandedGroups((prev) => ({ ...prev, [g]: !prev[g] }));

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center flex-shrink-0">
            <Squares2X2Icon className="w-3.5 h-3.5 text-sky-300" />
          </div>
          <span className="text-sm font-semibold text-white">Columns</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] tabular-nums bg-white/10 text-white/70">
            {selectedCount}/{totalCount}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3">
          {/* Quick actions */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setAll(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all min-h-[36px]"
            >
              Select all
            </button>
            <button
              onClick={() => setAll(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all min-h-[36px]"
            >
              Clear
            </button>
          </div>

          {/* Groups */}
          <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            {Object.entries(groupedFields).map(([groupName, fields]) => {
              const isExpanded = expandedGroups[groupName];
              const groupSelected = fields.filter(
                (f) => currentFields[f.key as keyof typeof currentFields]
              ).length;
              return (
                <div
                  key={groupName}
                  className="border border-white/10 rounded-xl overflow-hidden bg-black/10"
                >
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {GROUP_LABELS[groupName] || groupName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] tabular-nums bg-white/10 text-white/60">
                        {groupSelected}/{fields.length}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-white/50 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-2 pb-2 space-y-0.5">
                      {fields.map((field) => {
                        const isSelected =
                          currentFields[field.key as keyof typeof currentFields];
                        return (
                          <button
                            key={field.key}
                            onClick={() => handleFieldToggle(field.key)}
                            className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                          >
                            <span
                              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "bg-[#FF6633] border-[#FF6633] text-white"
                                  : "border-white/30"
                              }`}
                            >
                              {isSelected && <CheckIcon className="w-3 h-3" />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-sm ${
                                    isSelected ? "text-white" : "text-white/70"
                                  }`}
                                >
                                  {field.label}
                                </span>
                                {field.required && (
                                  <span className="px-1 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-200 border border-rose-400/30">
                                    req
                                  </span>
                                )}
                                {field.computed && (
                                  <span className="px-1 py-0.5 rounded text-[10px] bg-[#FF6633]/15 text-orange-200 border border-[#FF6633]/30">
                                    calc
                                  </span>
                                )}
                              </span>
                              {field.description && (
                                <span className="block text-[11px] text-white/40 mt-0.5 leading-relaxed">
                                  {field.description}
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCount === 0 && (
            <p className="text-amber-300 text-xs">
              Select at least one column to generate a report.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
