"use client";

import {
  CurrencyDollarIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { ReportType, ReportSummary } from "@/lib/report-types";

interface ReportStatsProps {
  reportType: ReportType;
  summary: ReportSummary;
}

export default function ReportStats({ reportType, summary }: ReportStatsProps) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  const bookingStats = [
    {
      label: "Total Records",
      value: formatNumber(summary.totalRecords),
      icon: CalendarDaysIcon,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-300",
    },
    {
      label: "Total Revenue",
      value: summary.totalRevenue
        ? formatCurrency(summary.totalRevenue)
        : "$0.00",
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/20",
      textColor: "text-green-300",
    },
    {
      label: "Avg Booking Value",
      value: summary.averageBookingValue
        ? formatCurrency(summary.averageBookingValue)
        : "$0.00",
      icon: ArrowTrendingUpIcon,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-300",
    },
    {
      label: "Total Hours",
      value: summary.totalHours ? `${formatNumber(summary.totalHours)}h` : "0h",
      icon: ClockIcon,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-300",
    },
  ];

  const lifeguardStats = [
    {
      label: "Total Records",
      value: formatNumber(summary.totalRecords),
      icon: UserGroupIcon,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-300",
    },
    {
      label: "Active Lifeguards",
      value: formatNumber(summary.totalActiveLifeguards || 0),
      icon: UserGroupIcon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/20",
      textColor: "text-green-300",
    },
    {
      label: "Total Assignments",
      value: formatNumber(summary.totalAssignments || 0),
      icon: CalendarDaysIcon,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-300",
    },
    {
      label: "Avg per Lifeguard",
      value: summary.averageAssignmentsPerLifeguard
        ? `${summary.averageAssignmentsPerLifeguard.toFixed(1)} assignments`
        : "0 assignments",
      icon: ChartBarIcon,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-300",
    },
  ];

  const stats = reportType === "bookings" ? bookingStats : lifeguardStats;

  const formatDateRange = () => {
    const startDate = new Date(summary.dateRange.startDate);
    const endDate = new Date(summary.dateRange.endDate);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return `${startDate.toLocaleDateString(
      "en-US",
      options
    )} - ${endDate.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
            <ChartBarIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">
              Report Summary
            </h3>
            <p className="text-white/60 text-xs md:text-sm">
              {formatDateRange()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-white/60 text-xs uppercase tracking-wider">
            {reportType === "bookings" ? "Bookings" : "Lifeguards"} Report
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all duration-200 group"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg md:rounded-xl`}
              ></div>

              {/* Content */}
              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 ${stat.bgColor} rounded-lg md:rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  {/* Trend indicator could go here */}
                </div>

                <div>
                  <div className="text-lg md:text-xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/60">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Hover effect border */}
              <div
                className={`absolute inset-0 rounded-lg md:rounded-xl border-2 border-transparent group-hover:border-white/20 transition-all duration-200`}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Additional Context */}
      {reportType === "bookings" &&
        summary.totalRevenue &&
        summary.totalHours && (
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Revenue per Hour
                </div>
                <div className="text-white font-bold">
                  {summary.totalHours > 0
                    ? formatCurrency(summary.totalRevenue / summary.totalHours)
                    : "$0.00"}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Days in Range
                </div>
                <div className="text-white font-bold">
                  {Math.ceil(
                    (new Date(summary.dateRange.endDate).getTime() -
                      new Date(summary.dateRange.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Bookings per Day
                </div>
                <div className="text-white font-bold">
                  {(
                    summary.totalRecords /
                    Math.max(
                      1,
                      Math.ceil(
                        (new Date(summary.dateRange.endDate).getTime() -
                          new Date(summary.dateRange.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  ).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
