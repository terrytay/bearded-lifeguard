"use client";

import { useState } from "react";
import { 
  CheckIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
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

export default function FieldSelector({
  reportType,
  bookingFields,
  lifeguardFields,
  onBookingFieldsChange,
  onLifeguardFieldsChange,
}: FieldSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    basic: true,
    service: true,
    financial: true,
    contact: false,
    timestamps: false,
    computed: false,
  });

  const currentFields = reportType === 'bookings' ? bookingFields : lifeguardFields;
  const fieldDefinitions = reportType === 'bookings' ? BOOKING_FIELD_DEFINITIONS : LIFEGUARD_FIELD_DEFINITIONS;
  
  // Group fields by category
  const groupedFields = fieldDefinitions.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = [];
    }
    acc[field.group].push(field);
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  // Count selected fields
  const selectedCount = Object.values(currentFields).filter(Boolean).length;
  const totalCount = fieldDefinitions.length;

  const handleFieldToggle = (fieldKey: string) => {
    if (reportType === 'bookings') {
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

  const handleSelectAll = () => {
    const allSelected = Object.keys(currentFields).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as any);

    if (reportType === 'bookings') {
      onBookingFieldsChange(allSelected);
    } else {
      onLifeguardFieldsChange(allSelected);
    }
  };

  const handleSelectNone = () => {
    const noneSelected = Object.keys(currentFields).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as any);

    if (reportType === 'bookings') {
      onBookingFieldsChange(noneSelected);
    } else {
      onLifeguardFieldsChange(noneSelected);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getGroupIcon = (groupName: string) => {
    const icons = {
      basic: "📝",
      service: "🏊",
      contact: "📞",
      financial: "💰",
      timestamps: "⏰",
      computed: "📊",
    };
    return icons[groupName as keyof typeof icons] || "📋";
  };

  const getGroupColor = (groupName: string) => {
    const colors = {
      basic: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      service: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      contact: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      financial: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
      timestamps: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
      computed: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30",
    };
    return colors[groupName as keyof typeof colors] || "from-gray-500/20 to-slate-500/20 border-gray-500/30";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
            <Squares2X2Icon className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">
              Fields Selection
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              {selectedCount} of {totalCount} fields selected
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="px-2 py-1 md:px-3 md:py-2 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-200"
          >
            All
          </button>
          <button
            onClick={handleSelectNone}
            className="px-2 py-1 md:px-3 md:py-2 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200"
          >
            None
          </button>
        </div>
      </div>

      {/* Field Groups */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(groupedFields).map(([groupName, fields]) => {
          const isExpanded = expandedGroups[groupName];
          const groupSelectedCount = fields.filter(field => 
            currentFields[field.key as keyof typeof currentFields]
          ).length;

          return (
            <div key={groupName} className={`border rounded-lg overflow-hidden ${getGroupColor(groupName)}`}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full px-3 py-2 md:px-4 md:py-3 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getGroupIcon(groupName)}</span>
                  <span className="font-medium text-white capitalize text-sm">
                    {groupName.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded">
                    {groupSelectedCount}/{fields.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-white/60" />
                )}
              </button>

              {/* Group Fields */}
              {isExpanded && (
                <div className="px-3 py-2 md:px-4 md:py-3 space-y-2 bg-white/2">
                  {fields.map((field) => {
                    const isSelected = currentFields[field.key as keyof typeof currentFields];
                    
                    return (
                      <div
                        key={field.key}
                        className="flex items-start justify-between p-2 rounded hover:bg-white/5 transition-all duration-200 group"
                      >
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <button
                            onClick={() => handleFieldToggle(field.key)}
                            className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-500 text-white'
                                : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            {isSelected && <CheckIcon className="w-3 h-3" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                {field.label}
                              </span>
                              {field.required && (
                                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                                  Required
                                </span>
                              )}
                              {field.computed && (
                                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                                  Computed
                                </span>
                              )}
                            </div>
                            {field.description && (
                              <p className="text-xs text-white/60 mt-1">
                                {field.description}
                              </p>
                            )}
                          </div>
                          
                          {field.description && (
                            <div className="flex-shrink-0">
                              <QuestionMarkCircleIcon 
                                className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                title={field.description}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70 font-medium">Selected Fields:</span>
          <span className="text-white font-bold">{selectedCount} fields</span>
        </div>
        {selectedCount === 0 && (
          <p className="text-yellow-300 text-xs mt-2 flex items-center">
            <XMarkIcon className="w-3 h-3 mr-1" />
            Please select at least one field to generate a report
          </p>
        )}
      </div>
    </div>
  );
}