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
} from "@/lib/report-types";
import { SingaporeTime } from "@/lib/singapore-time";

interface DataPreviewProps {
  reportType: ReportType;
  data: BookingReportData[] | LifeguardReportData[];
  loading: boolean;
  fields: BookingReportFields | LifeguardReportFields;
}

export default function DataPreview({
  reportType,
  data,
  loading,
  fields,
}: DataPreviewProps) {
  // Get selected field definitions
  const allFieldDefinitions = reportType === 'bookings' ? BOOKING_FIELD_DEFINITIONS : LIFEGUARD_FIELD_DEFINITIONS;
  const selectedFields = allFieldDefinitions.filter(field => 
    fields[field.key as keyof typeof fields]
  );

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === '') return '-';
    
    switch (type) {
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
      case 'date':
        try {
          return SingaporeTime.format(value, 'MMM dd, yyyy HH:mm');
        } catch {
          return value;
        }
      case 'boolean':
        return value ? '✓ Yes' : '✗ No';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const getFieldType = (fieldKey: string) => {
    const field = allFieldDefinitions.find(f => f.key === fieldKey);
    return field?.type || 'string';
  };

  const previewData = data.slice(0, 10); // Show first 10 rows

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
              <EyeIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm md:text-base">
                Data Preview
              </h3>
              <p className="text-white/60 text-xs md:text-sm">
                {loading ? 'Loading...' : `Showing first ${Math.min(previewData.length, 10)} of ${data.length} records`}
              </p>
            </div>
          </div>
          
          {selectedFields.length === 0 && (
            <div className="flex items-center space-x-2 text-yellow-300">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-xs">No fields selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
            <span className="text-white/70">Loading report data...</span>
          </div>
        </div>
      )}

      {/* No Fields Selected */}
      {!loading && selectedFields.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TableCellsIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Fields Selected</h4>
          <p className="text-white/60 text-sm mb-4">
            Please select at least one field to preview the report data
          </p>
        </div>
      )}

      {/* No Data */}
      {!loading && selectedFields.length > 0 && data.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <InformationCircleIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Data Found</h4>
          <p className="text-white/60 text-sm mb-4">
            No records found for the selected date range and filters
          </p>
        </div>
      )}

      {/* Data Table */}
      {!loading && selectedFields.length > 0 && data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {selectedFields.map((field) => (
                    <th
                      key={field.key}
                      className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider min-w-[120px]"
                    >
                      <div className="flex items-center space-x-1">
                        <span className="truncate">{field.label}</span>
                        {field.computed && (
                          <span className="px-1 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                            C
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                {previewData.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-white/5 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white/2' : ''
                    }`}
                  >
                    {selectedFields.map((field) => (
                      <td
                        key={field.key}
                        className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-white/90"
                      >
                        <div className="truncate max-w-[200px]" title={String(row[field.key as keyof typeof row] || '')}>
                          {formatCellValue(
                            row[field.key as keyof typeof row],
                            getFieldType(field.key)
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              <div className="flex items-center space-x-4 text-xs md:text-sm text-white/60">
                <span>Preview: {previewData.length} rows</span>
                <span>•</span>
                <span>Total: {data.length} records</span>
                <span>•</span>
                <span>Fields: {selectedFields.length}</span>
              </div>
              
              {data.length > 10 && (
                <div className="text-xs text-white/60">
                  {data.length - 10} more records available in full export
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}