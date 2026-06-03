"use client";

import { useState } from "react";
import { TableCellsIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface ExportActionsProps {
  onExport: (format: "csv" | "pdf") => Promise<void>;
  disabled: boolean;
  totalRecords: number;
}

export default function ExportActions({
  onExport,
  disabled,
  totalRecords,
}: ExportActionsProps) {
  const [exportingFormat, setExportingFormat] = useState<"csv" | "pdf" | null>(
    null
  );

  const handleExport = async (format: "csv" | "pdf") => {
    setExportingFormat(format);
    try {
      await onExport(format);
    } finally {
      setExportingFormat(null);
    }
  };

  const noData = totalRecords === 0;

  const btn = (
    format: "csv" | "pdf",
    label: string,
    Icon: typeof TableCellsIcon,
    primary: boolean
  ) => {
    const isExporting = exportingFormat === format;
    const enabled = !(disabled || noData || isExporting);
    const base =
      "flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] border transition-all";
    const look = !enabled
      ? "opacity-40 cursor-not-allowed border-ink/15 text-ink-soft"
      : primary
      ? "bg-ink text-paper border-ink hover:bg-signal hover:border-signal"
      : "border-ink/30 text-ink hover:bg-ink hover:text-paper hover:border-ink";
    return (
      <button
        onClick={() => handleExport(format)}
        disabled={!enabled}
        className={`${base} ${look}`}
      >
        {isExporting ? (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span>{isExporting ? "…" : label}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-display text-base font-semibold text-ink tabular-nums leading-none">
          {noData ? "No records" : `${totalRecords.toLocaleString()} records`}
        </div>
        <div className="text-[11px] text-ink-soft truncate mt-0.5">
          {noData ? "Adjust filters or date range" : "Ready to export"}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {btn("csv", "CSV", TableCellsIcon, false)}
        {btn("pdf", "PDF", DocumentTextIcon, true)}
      </div>
    </div>
  );
}
