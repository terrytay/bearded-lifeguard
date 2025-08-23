'use client';

import React, { useState } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export function TimePicker({ value, onChange, label, className = '' }: TimePickerProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Parse current time
  const [hour, minute] = value ? value.split(':').map(Number) : [9, 0];
  
  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formatDisplayTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const updateTime = (newHour: number, newMinute: number) => {
    const timeString = formatTime(newHour, newMinute);
    onChange(timeString);
  };

  const adjustHour = (delta: number) => {
    let newHour = hour + delta;
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    updateTime(newHour, minute);
  };

  const adjustMinute = (delta: number) => {
    let newMinute = minute + delta;
    let newHour = hour;
    
    if (newMinute < 0) {
      newMinute = 45;
      newHour = hour - 1;
      if (newHour < 0) newHour = 23;
    }
    if (newMinute > 59) {
      newMinute = 0;
      newHour = hour + 1;
      if (newHour > 23) newHour = 0;
    }
    
    updateTime(newHour, newMinute);
  };

  const quickTimeButtons = [
    { label: '9:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '4:00 PM', value: '16:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '8:00 PM', value: '20:00' },
  ];

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base transition-all duration-200 
          focus-within:border-[#FF6633] focus-within:ring-4 focus-within:ring-[#FF6633]/10 cursor-pointer
          flex items-center justify-between bg-white hover:border-gray-300"
        onClick={() => setShowTimePicker(!showTimePicker)}
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? formatDisplayTime(hour, minute) : `Select ${label.toLowerCase()}`}
          </span>
        </div>
        <div className={`transform transition-transform ${showTimePicker ? 'rotate-180' : ''}`}>
          <ChevronUp className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {showTimePicker && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-6">
          {/* Quick Time Buttons */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Select</h4>
            <div className="grid grid-cols-4 gap-2">
              {quickTimeButtons.map(({ label, value: timeValue }) => (
                <button
                  key={timeValue}
                  type="button"
                  onClick={() => {
                    onChange(timeValue);
                    setShowTimePicker(false);
                  }}
                  className="px-3 py-2 text-xs rounded-lg border border-gray-200 hover:border-[#FF6633] hover:bg-orange-50 hover:text-[#FF6633] transition-colors text-center font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time Picker */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Custom Time</h4>
            
            <div className="flex items-center justify-center gap-6">
              {/* Hour Picker */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-2">Hour</label>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                  <button
                    type="button"
                    onClick={() => adjustHour(1)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="py-3 min-w-[60px] text-center">
                    <span className="text-2xl font-bold text-[#FF6633]">
                      {hour.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => adjustHour(-1)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-400 py-8">:</div>

              {/* Minute Picker */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-2">Minute</label>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                  <button
                    type="button"
                    onClick={() => adjustMinute(15)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="py-3 min-w-[60px] text-center">
                    <span className="text-2xl font-bold text-[#FF6633]">
                      {minute.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => adjustMinute(-15)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">15 min steps</div>
              </div>

              {/* AM/PM Indicator */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-2">Period</label>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-lg font-bold text-gray-700 min-w-[40px] text-center py-6">
                    {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 mb-2">Selected Time</div>
              <div className="text-xl font-bold text-[#FF6633]">
                {formatDisplayTime(hour, minute)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowTimePicker(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setShowTimePicker(false)}
              className="px-6 py-2 text-sm bg-[#FF6633] text-white rounded-lg hover:bg-[#e55a2b] transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}