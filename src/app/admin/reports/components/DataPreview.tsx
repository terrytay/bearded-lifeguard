"use client";

import {
  EyeIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ReportType,
  BookingReportFields,
  LifeguardReportFields,
  BookingReportData,
  LifeguardReportData,
  BOOKING_FIELD_DEFINITIONS,
  LIFEGUARD_FIELD_DEFINITIONS,
  FieldDefinition,
} from "@/lib/report-types";
import { SingaporeTime } from "@/lib/singapore-time";

interface DataPreviewProps {
  reportType: ReportType;
  data: BookingReportData[] | LifeguardReportData[];
  loading: boolean;
  fields: BookingReportFields | LifeguardReportFields;
}

const STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  pending: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  confirmed: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  completed: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  refunded: "bg-rose-500/15 text-rose-200 border-rose-400/30",
};

function StatusBadge({ value }: { value: string }) {
  const cls =
    STATUS_BADGE[value] || "bg-white/10 text-white/70 border-white/15";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] border ${cls} whitespace-nowrap`}
    >
      {value}
    </span>
  );
}

export default function DataPreview({
  reportType,
  data,
  loading,
  fields,
}: DataPreviewProps) {
  const allFieldDefinitions =
    reportType === "bookings"
      ? BOOKING_FIELD_DEFINITIONS
      : LIFEGUARD_FIELD_DEFINITIONS;
  const selectedFields = allFieldDefinitions.filter(
    (field) => fields[field.key as keyof typeof fields]
  );

  const getFieldType = (key: string) =>
    allFieldDefinitions.find((f) => f.key === key)?.type || "string";

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === "") return "—";
    switch (type) {
      case "currency":
        return typeof value === "number" ? `$${value.toFixed(2)}` : value;
      case "date":
        try {
          return SingaporeTime.format(value, "dd MMM yyyy HH:mm");
        } catch {
          return value;
        }
      case "boolean":
        return value ? "Yes" : "No";
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const isNumeric = (type: string) =>
    type === "number" || type === "currency";

  const previewData = data.slice(0, 10);
  const titleKey = reportType === "bookings" ? "order_id" : "name";

  // Renders one cell's content with special-casing for badges/flags
  const renderValue = (row: any, field: FieldDefinition) => {
    const v = row[field.key as keyof typeof row];
    if (field.key === "is_prorated") {
      return v ? (
        <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500/20 text-amber-200 border border-amber-400/30 whitespace-nowrap">
          Prorated
        </span>
      ) : (
        <span className="text-white/35 text-xs">Full</span>
      );
    }
    if (field.key === "status" || field.key === "payment_status") {
      return v ? <StatusBadge value={String(v)} /> : "—";
    }
    return formatCellValue(v, field.type);
  };

  const headerNote = loading
    ? "Loading…"
    : `Showing ${Math.min(previewData.length, 10)} of ${data.length} records`;

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF6633]/15 border border-[#FF6633]/30 flex items-center justify-center flex-shrink-0">
            <EyeIcon className="w-3.5 h-3.5 text-[#FF6633]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">Preview</h3>
            <p className="text-[11px] text-white/40 truncate">{headerNote}</p>
          </div>
        </div>
        {selectedFields.length === 0 && (
          <span className="flex items-center gap-1.5 text-amber-300 text-xs flex-shrink-0">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">No columns</span>
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-4 md:p-6 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}

      {/* No columns */}
      {!loading && selectedFields.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-14 h-14 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <TableCellsIcon className="w-7 h-7 text-amber-300" />
          </div>
          <h4 className="text-white font-semibold mb-1">No columns selected</h4>
          <p className="text-white/50 text-sm">
            Open <span className="text-white/80">Columns</span> and pick at least
            one field.
          </p>
        </div>
      )}

      {/* No data */}
      {!loading && selectedFields.length > 0 && data.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-14 h-14 bg-sky-500/15 border border-sky-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <InformationCircleIcon className="w-7 h-7 text-sky-300" />
          </div>
          <h4 className="text-white font-semibold mb-1">No records found</h4>
          <p className="text-white/50 text-sm">
            Nothing matches this date range and filters.
          </p>
        </div>
      )}

      {/* Data */}
      {!loading && selectedFields.length > 0 && data.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/20 sticky top-0">
                <tr>
                  {selectedFields.map((field) => (
                    <th
                      key={field.key}
                      className="px-4 py-3 text-left text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] whitespace-nowrap"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {previewData.map((row: any, index) => {
                  const prorated = Boolean(row.is_prorated);
                  const cancelled = row.status === "cancelled";
                  return (
                    <tr
                      key={index}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        cancelled
                          ? "bg-rose-500/[0.07]"
                          : prorated
                          ? "bg-amber-500/[0.06]"
                          : ""
                      }`}
                    >
                      {selectedFields.map((field) => (
                        <td
                          key={field.key}
                          className={`px-4 py-2.5 text-white/85 ${
                            isNumeric(field.type) ? "tabular-nums" : ""
                          }`}
                        >
                          <div
                            className={
                              field.key === "proration_note"
                                ? "max-w-[340px] text-[11px] text-white/55 leading-relaxed whitespace-normal"
                                : "truncate max-w-[220px]"
                            }
                            title={String(row[field.key] ?? "")}
                          >
                            {renderValue(row, field)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/5">
            {previewData.map((row: any, index) => {
              const prorated = Boolean(row.is_prorated);
              const cancelled = row.status === "cancelled";
              const title = row[titleKey];
              const bodyFields = selectedFields.filter(
                (f) =>
                  f.key !== titleKey &&
                  f.key !== "status" &&
                  f.key !== "payment_status" &&
                  f.key !== "is_prorated" &&
                  f.key !== "proration_note"
              );
              return (
                <div
                  key={index}
                  className={`p-4 ${
                    cancelled
                      ? "bg-rose-500/[0.07]"
                      : prorated
                      ? "bg-amber-500/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="text-sm font-bold text-white truncate">
                      {title !== undefined && title !== null && title !== ""
                        ? reportType === "bookings"
                          ? `#${title}`
                          : title
                        : `Row ${index + 1}`}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      {fields["status" as keyof typeof fields] && row.status && (
                        <StatusBadge value={String(row.status)} />
                      )}
                      {fields["payment_status" as keyof typeof fields] &&
                        row.payment_status && (
                          <StatusBadge value={String(row.payment_status)} />
                        )}
                      {fields["is_prorated" as keyof typeof fields] &&
                        prorated && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500/20 text-amber-200 border border-amber-400/30">
                            Prorated
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {bodyFields.map((field) => (
                      <div key={field.key} className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                          {field.label}
                        </div>
                        <div
                          className={`text-sm text-white/85 truncate ${
                            isNumeric(field.type) ? "tabular-nums" : ""
                          }`}
                          title={String(row[field.key] ?? "")}
                        >
                          {renderValue(row, field)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {fields["proration_note" as keyof typeof fields] &&
                    row.proration_note && (
                      <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[11px] text-white/50 leading-relaxed">
                        {row.proration_note}
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
            <span className="tabular-nums">
              {previewData.length} of {data.length} · {selectedFields.length}{" "}
              columns
            </span>
            {data.length > 10 && (
              <span className="tabular-nums">
                +{data.length - 10} more in export
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
