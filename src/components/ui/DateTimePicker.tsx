"use client";

import React, { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { SingaporeTime } from "@/lib/singapore-time";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  label: string;
  error?: boolean;
  onBlur?: () => void;
}

export function DateTimePicker({
  value,
  onChange,
  min,
  label,
  error,
  onBlur,
}: DateTimePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? value.split("T")[0] : ""
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? value.split("T")[1] || "09:00" : "09:00"
  );

  const currentDate = SingaporeTime.now();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const minDate = min ? new Date(min) : SingaporeTime.now();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const timeSlots = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(timeString);
    }
  }

  const handleDateSelect = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    setSelectedDate(dateStr);

    // Validate the combined datetime before setting it
    if (isDateTimeInPast(dateStr, selectedTime)) {
      // If combined datetime is in the past, reset time to minimum valid time for this date
      const minValidTime = getMinTimeForDate(dateStr);
      if (minValidTime) {
        setSelectedTime(minValidTime);
        onChange(`${dateStr}T${minValidTime}`);
      } else {
        // If no min time needed (future date), use current time selection
        onChange(`${dateStr}T${selectedTime}`);
      }
    } else {
      onChange(`${dateStr}T${selectedTime}`);
    }

    // Check if we have both date and time - if so, auto-close
    if (selectedTime && selectedTime !== "09:00") {
      // User had already selected a time, now they selected date - auto-close
      setTimeout(() => {
        setShowCalendar(false);
      }, 500);
      onBlur?.();
      return;
    }

    // Don't close calendar immediately - let user select time first if not mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // On mobile, wait a bit then scroll to time section
      setTimeout(() => {
        const timeSection = document.querySelector(".time-selection-section");
        timeSection?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
    onBlur?.();
  };

  const handleTimeSelect = (time: string) => {
    const dateToUse =
      selectedDate ||
      `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

    // Validate the combined datetime before setting it
    if (isDateTimeInPast(dateToUse, time)) {
      // Don't allow selecting past time
      return;
    }

    setSelectedTime(time);
    const fullDateTime = `${dateToUse}T${time}`;
    onChange(fullDateTime);

    // Always auto-close after time selection if we have a date selected
    if (selectedDate) {
      setTimeout(() => {
        setShowCalendar(false);
      }, 500); // Small delay to show selection
      onBlur?.();
    }
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (
      currentYear === minDate.getFullYear() &&
      currentMonth === minDate.getMonth() &&
      day === minDate.getDate()
    ) {
      return false;
    }

    return date < minDate;
  };

  // Check if a time slot should be disabled (for past times on today's date)
  const isTimeDisabled = (timeString: string) => {
    if (!selectedDate) return false;

    const selectedDateObj = new Date(selectedDate);
    const today = SingaporeTime.now();

    // Only disable times if the selected date is today
    const isToday =
      selectedDateObj.getFullYear() === today.getFullYear() &&
      selectedDateObj.getMonth() === today.getMonth() &&
      selectedDateObj.getDate() === today.getDate();

    if (!isToday) return false;

    // Parse time string (HH:MM) and create a date object for comparison
    const [hours, minutes] = timeString.split(":").map(Number);
    const timeDate = new Date(selectedDateObj);
    timeDate.setHours(hours, minutes, 0, 0);

    // Disable if the time is before the minimum allowed time (rounded to next 15 min)
    const minAllowedTime = SingaporeTime.nowRounded15();
    return timeDate < minAllowedTime;
  };

  // Check if a datetime combination is in the past
  const isDateTimeInPast = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return false;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const dateTime = new Date(dateStr);
    dateTime.setHours(hours, minutes, 0, 0);

    const minAllowedTime = SingaporeTime.nowRounded15();
    return dateTime < minAllowedTime;
  };

  // Get minimum time for a specific date
  const getMinTimeForDate = (dateStr: string) => {
    if (!dateStr) return undefined;

    const selectedDateObj = new Date(dateStr);
    const today = SingaporeTime.now();

    // Only set min time if selected date is today
    const isToday =
      selectedDateObj.getFullYear() === today.getFullYear() &&
      selectedDateObj.getMonth() === today.getMonth() &&
      selectedDateObj.getDate() === today.getDate();

    if (!isToday) return undefined;

    // Return current time rounded to next 15 minutes in HH:MM format
    const minTime = SingaporeTime.nowRounded15();
    const hours = minTime.getHours().toString().padStart(2, "0");
    const minutes = minTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Get minimum time for today (for the time input) - wrapper for backward compatibility
  const getMinTimeForToday = () => {
    return getMinTimeForDate(selectedDate);
  };

  const formatDisplayValue = () => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("en-SG", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const baseStyles = `w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 
    focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 cursor-pointer
    flex items-center justify-between bg-white hover:border-gray-300`;

  const stateStyles = error
    ? "border-red-300 focus:border-red-500"
    : "border-gray-200 focus:border-[#FF6633]";

  return (
    <div className="relative z-[9999]">
      <div
        className={`${baseStyles} ${stateStyles}`}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDisplayValue() : `Select ${label.toLowerCase()}`}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-[#20334F]">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isDisabled = isDateDisabled(day);
              const isSelected =
                selectedDate ===
                `${currentYear}-${(currentMonth + 1)
                  .toString()
                  .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`p-3 text-sm rounded-lg transition-all transform active:scale-95 ${
                    isSelected
                      ? "bg-[#FF6633] text-white shadow-md"
                      : isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-900 hover:shadow-sm"
                  }`}
                  style={{ minHeight: "44px", minWidth: "44px" }} // Better mobile touch targets
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Enhanced Time Selection */}
          <div className="border-t pt-4 time-selection-section z-[99]">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Select precise time
              </span>
            </div>

            {/* Quick Time Slots */}
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-600 mb-2">
                Quick Select (15-min intervals)
              </div>
              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const disabled = isTimeDisabled(time);
                    return (
                      !disabled && (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !disabled && handleTimeSelect(time)}
                          disabled={disabled}
                          className={`px-3 py-2 text-sm rounded-lg transition-all transform ${
                            disabled
                              ? "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                              : selectedTime === time
                              ? "bg-[#FF6633] text-white shadow-md active:scale-95"
                              : "hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#FF6633] hover:text-[#FF6633] active:scale-95"
                          }`}
                          style={{ minHeight: "40px" }} // Better mobile touch targets
                        >
                          {(() => {
                            const [h, m] = time.split(":").map(Number);
                            const period = h >= 12 ? "PM" : "AM";
                            const displayHour =
                              h === 0 ? 12 : h > 12 ? h - 12 : h;
                            return `${displayHour}:${m
                              .toString()
                              .padStart(2, "0")} ${period}`;
                          })()}
                        </button>
                      )
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Time Input */}
            <div className="border-t pt-4">
              <div className="text-xs font-medium text-gray-600 mb-2">
                Custom Time (any minute)
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeSelect(e.target.value)}
                  min={getMinTimeForToday()}
                  className="flex-1 px-3 py-3 border border-gray-200 rounded-lg text-base focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20 outline-none bg-white"
                  step="60"
                  style={{ minHeight: "44px" }} // Better mobile touch target
                />
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  Any minute
                </div>
              </div>
            </div>

            {/* Selected Time Display */}
            {selectedTime && selectedDate && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-xs text-green-700 font-medium mb-1">
                    ✓ Selected Date & Time
                  </div>
                  <div className="text-sm font-semibold text-green-800">
                    {new Date(
                      `${selectedDate}T${selectedTime}`
                    ).toLocaleDateString("en-SG", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    {(() => {
                      const [h, m] = selectedTime.split(":").map(Number);
                      const period = h >= 12 ? "PM" : "AM";
                      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                      return `${displayHour}:${m
                        .toString()
                        .padStart(2, "0")} ${period}`;
                    })()}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Picker will close automatically
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
