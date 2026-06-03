"use client";

import { useState } from "react";
import {
  TableCellsIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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
    accent: string
  ) => {
    const isExporting = exportingFormat === format;
    return (
      <button
        onClick={() => handleExport(format)}
        disabled={disabled || noData || isExporting}
        className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] border transition-all duration-150 ${
          disabled || noData || isExporting
            ? "opacity-40 cursor-not-allowed border-white/10 text-white/50"
            : `${accent} hover:scale-[1.02] active:scale-[0.98]`
        }`}
      >
        {isExporting ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="text-sm font-semibold text-white tabular-nums">
          {noData ? "No records" : `${totalRecords.toLocaleString()} records`}
        </div>
        <div className="text-[11px] text-white/40 truncate">
          {noData ? "Adjust filters or date range" : "Ready to export"}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {btn(
          "csv",
          "CSV",
          TableCellsIcon,
          "bg-emerald-500/15 text-emerald-200 border-emerald-400/40"
        )}
        {btn(
          "pdf",
          "PDF",
          DocumentTextIcon,
          "bg-[#FF6633]/20 text-orange-200 border-[#FF6633]/50"
        )}
      </div>
    </div>
  );
}
