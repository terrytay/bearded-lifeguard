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
    <div className="bg-white border border-ink/12 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-sand/40 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Squares2X2Icon className="w-4 h-4 text-ink-soft" />
          <span className="text-sm font-semibold text-ink">Columns</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] tabular-nums bg-ink/8 text-ink-soft">
            {selectedCount}/{totalCount}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-ink/12 space-y-3">
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setAll(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-ink-soft border border-ink/20 hover:border-ink/50 hover:text-ink transition-all min-h-[36px]"
            >
              Select all
            </button>
            <button
              onClick={() => setAll(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-ink-soft border border-ink/20 hover:border-ink/50 hover:text-ink transition-all min-h-[36px]"
            >
              Clear
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            {Object.entries(groupedFields).map(([groupName, fields]) => {
              const isExpanded = expandedGroups[groupName];
              const groupSelected = fields.filter(
                (f) => currentFields[f.key as keyof typeof currentFields]
              ).length;
              return (
                <div
                  key={groupName}
                  className="border border-ink/12 rounded-xl overflow-hidden bg-sand/30"
                >
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-sand/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {GROUP_LABELS[groupName] || groupName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] tabular-nums bg-ink/8 text-ink-soft">
                        {groupSelected}/{fields.length}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-ink-soft transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-2 pb-2 space-y-0.5 bg-white">
                      {fields.map((field) => {
                        const isSelected =
                          currentFields[field.key as keyof typeof currentFields];
                        return (
                          <button
                            key={field.key}
                            onClick={() => handleFieldToggle(field.key)}
                            className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-sand/50 transition-colors text-left"
                          >
                            <span
                              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "bg-ink border-ink text-paper"
                                  : "border-ink/30"
                              }`}
                            >
                              {isSelected && <CheckIcon className="w-3 h-3" />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-sm ${
                                    isSelected ? "text-ink" : "text-ink-soft"
                                  }`}
                                >
                                  {field.label}
                                </span>
                                {field.required && (
                                  <span className="px-1 py-0.5 rounded text-[10px] uppercase tracking-wider bg-signal/10 text-signal border border-signal/30">
                                    req
                                  </span>
                                )}
                                {field.computed && (
                                  <span className="px-1 py-0.5 rounded text-[10px] uppercase tracking-wider bg-sea/10 text-sea border border-sea/30">
                                    calc
                                  </span>
                                )}
                              </span>
                              {field.description && (
                                <span className="block text-[11px] text-ink-soft mt-0.5 leading-relaxed">
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
            <p className="text-ochre text-xs">
              Select at least one column to generate a report.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
