"use client";

import { CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { ReportType } from "@/lib/report-types";

interface ReportTypeSelectorProps {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
}

export default function ReportTypeSelector({
  reportType,
  onReportTypeChange,
}: ReportTypeSelectorProps) {
  const reportTypes = [
    {
      type: 'bookings' as ReportType,
      label: 'Bookings Report',
      description: 'Revenue, customer data, and booking analytics',
      icon: CalendarDaysIcon,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      type: 'lifeguards' as ReportType,
      label: 'Lifeguards Report',
      description: 'Performance metrics and assignment statistics',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-white font-semibold text-sm md:text-base flex items-center">
        <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2"></span>
        Report Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = reportType === type.type;
          
          return (
            <button
              key={type.type}
              onClick={() => onReportTypeChange(type.type)}
              className={`p-4 md:p-6 rounded-lg md:rounded-xl border transition-all duration-200 text-left hover:scale-[1.02] ${
                isSelected
                  ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm md:text-base mb-1">
                    {type.label}
                  </h4>
                  <p className={`text-xs md:text-sm ${
                    isSelected ? 'text-white/90' : 'text-white/60'
                  }`}>
                    {type.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-3 h-3 bg-white rounded-full mt-1"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}