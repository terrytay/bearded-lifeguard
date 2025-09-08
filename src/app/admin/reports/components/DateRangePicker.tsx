"use client";

import { useState } from "react";
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getDateRangePresets } from "@/lib/report-types";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState(false);

  const presets = getDateRangePresets();

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.value);
    setCustomMode(false);
    onDateRangeChange(preset.startDate, preset.endDate);
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    if (field === 'start') {
      onDateRangeChange(newDate, endDate);
    } else {
      onDateRangeChange(startDate, newDate);
    }
    setSelectedPreset(null);
    setCustomMode(true);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const getDaysDifference = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center">
          <CalendarDaysIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm md:text-base">
            Date Range
          </h3>
          <p className="text-white/60 text-xs md:text-sm">
            {formatDateRange()} ({getDaysDifference()} days)
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-white/70 text-sm font-medium">Quick Select:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetSelect(preset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedPreset === preset.value
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white/70 text-sm font-medium">Custom Range:</label>
          {customMode && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
              Custom
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-white/60 text-xs">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={formatDateForInput(startDate)}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                max={formatDateForInput(endDate)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/60 text-xs">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={formatDateForInput(endDate)}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                min={formatDateForInput(startDate)}
                max={formatDateForInput(new Date())}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Summary */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="text-white/70">
            <span className="font-medium">Selected Range:</span>
          </div>
          <div className="text-white font-medium">
            {getDaysDifference()} {getDaysDifference() === 1 ? 'day' : 'days'}
          </div>
        </div>
        <div className="mt-2 text-xs text-white/60">
          From {startDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })} to {endDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
}