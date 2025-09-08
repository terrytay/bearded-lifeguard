"use client";

import { useState } from "react";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CloudArrowDownIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ExportActionsProps {
  onExport: (format: 'csv' | 'pdf') => Promise<void>;
  disabled: boolean;
  totalRecords: number;
}

export default function ExportActions({
  onExport,
  disabled,
  totalRecords,
}: ExportActionsProps) {
  const [exportingFormat, setExportingFormat] = useState<'csv' | 'pdf' | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExportingFormat(format);
    try {
      await onExport(format);
    } finally {
      setExportingFormat(null);
    }
  };

  const exportOptions = [
    {
      format: 'csv' as const,
      label: 'Export to CSV',
      description: 'Download as spreadsheet file',
      icon: TableCellsIcon,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      hoverColor: 'hover:bg-green-500/20',
    },
    {
      format: 'pdf' as const,
      label: 'Export to PDF',
      description: 'Download as formatted report',
      icon: DocumentTextIcon,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      hoverColor: 'hover:bg-red-500/20',
    },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center">
            <CloudArrowDownIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">
              Export Data
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              {totalRecords > 0 
                ? `Ready to export ${totalRecords.toLocaleString()} records`
                : 'No data available for export'
              }
            </p>
          </div>
        </div>
        
        {totalRecords > 0 && (
          <div className="text-right">
            <div className="text-white/60 text-xs uppercase tracking-wider">
              Available Formats
            </div>
          </div>
        )}
      </div>

      {/* Export Buttons */}
      {totalRecords > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isExporting = exportingFormat === option.format;
            
            return (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                disabled={disabled || isExporting}
                className={`relative p-4 md:p-6 border rounded-lg md:rounded-xl transition-all duration-200 text-left group ${
                  disabled || isExporting
                    ? 'opacity-50 cursor-not-allowed'
                    : `${option.bgColor} ${option.borderColor} ${option.hoverColor} hover:scale-[1.02] active:scale-[0.98]`
                }`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-lg md:rounded-xl`}></div>
                
                {/* Content */}
                <div className="relative flex items-start space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${option.bgColor} rounded-lg md:rounded-xl flex items-center justify-center border ${option.borderColor}`}>
                    {isExporting ? (
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm md:text-base mb-1">
                      {isExporting ? 'Generating...' : option.label}
                    </h4>
                    <p className="text-white/60 text-xs md:text-sm mb-2">
                      {isExporting 
                        ? `Preparing your ${option.format.toUpperCase()} file...`
                        : option.description
                      }
                    </p>
                    
                    {/* Format Details */}
                    <div className="flex items-center space-x-2 text-xs text-white/50">
                      <span>Format: {option.format.toUpperCase()}</span>
                      <span>•</span>
                      <span>Size: ~{Math.ceil(totalRecords / 100)}MB</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {isExporting ? (
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                      </div>
                    ) : (
                      <DocumentArrowDownIcon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                    )}
                  </div>
                </div>
                
                {/* Progress indicator for large exports */}
                {isExporting && totalRecords > 1000 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* No Data State */
        <div className="text-center py-8 md:py-12">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Data to Export</h4>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            {disabled 
              ? 'Please wait for the report to load before exporting'
              : 'No records found for the selected criteria. Try adjusting your filters or date range.'
            }
          </p>
        </div>
      )}

      {/* Export Tips */}
      {totalRecords > 0 && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3 md:p-4">
            <div className="flex items-start space-x-2">
              <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm text-white/70">
                <strong className="text-white/90">Export Tips:</strong>
                <ul className="mt-1 space-y-1 ml-2">
                  <li>• CSV files open in Excel, Google Sheets, and other spreadsheet apps</li>
                  <li>• PDF files are formatted for professional reporting and printing</li>
                  <li>• Large exports may take a few moments to generate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}