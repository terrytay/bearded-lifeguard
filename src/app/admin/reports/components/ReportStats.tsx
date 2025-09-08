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
      label: "Actual Revenue",
      value: summary.actualRevenue
        ? formatCurrency(summary.actualRevenue)
        : "$0.00",
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/20",
      textColor: "text-green-300",
      description: "Revenue from paid, non-cancelled bookings",
    },
    {
      label: "Potential Revenue",
      value: summary.potentialRevenue
        ? formatCurrency(summary.potentialRevenue)
        : "$0.00",
      icon: ArrowTrendingUpIcon,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-300",
      description: "Revenue from pending payments",
    },
    {
      label: "Lost Revenue",
      value: summary.lostRevenue
        ? formatCurrency(summary.lostRevenue)
        : "$0.00",
      icon: CalendarDaysIcon,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-500/20",
      textColor: "text-red-300",
      description: "Revenue from cancelled bookings",
    },
    {
      label: "Collection Rate",
      value: summary.paymentCollectionRate
        ? `${summary.paymentCollectionRate.toFixed(1)}%`
        : "0%",
      icon: ChartBarIcon,
      color:
        summary.paymentCollectionRate && summary.paymentCollectionRate >= 80
          ? "from-green-500 to-emerald-600"
          : summary.paymentCollectionRate && summary.paymentCollectionRate >= 60
          ? "from-yellow-500 to-orange-600"
          : "from-red-500 to-pink-600",
      bgColor:
        summary.paymentCollectionRate && summary.paymentCollectionRate >= 80
          ? "bg-green-500/20"
          : summary.paymentCollectionRate && summary.paymentCollectionRate >= 60
          ? "bg-yellow-500/20"
          : "bg-red-500/20",
      textColor:
        summary.paymentCollectionRate && summary.paymentCollectionRate >= 80
          ? "text-green-300"
          : summary.paymentCollectionRate && summary.paymentCollectionRate >= 60
          ? "text-yellow-300"
          : "text-red-300",
      description: "Percentage of confirmed bookings that are paid",
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
            {reportType === "bookings" ? "Enhanced Revenue" : "Lifeguards"}{" "}
            Report
          </div>
          {reportType === "bookings" && summary.totalRecords && (
            <div className="text-white/80 text-xs mt-1">
              {summary.totalRecords} bookings analyzed
            </div>
          )}
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

      {/* Revenue Health Status Indicator */}
      {reportType === "bookings" && summary.revenueHealthStatus && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                summary.revenueHealthStatus === "healthy"
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : summary.revenueHealthStatus === "attention"
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  : "bg-red-500/20 text-red-300 border-red-500/30"
              }`}
            >
              {summary.revenueHealthStatus === "healthy"
                ? "🟢 Healthy Revenue Performance"
                : summary.revenueHealthStatus === "attention"
                ? "🟡 Revenue Needs Attention"
                : "🔴 Revenue Performance Concerning"}
            </div>
          </div>

          {/* Enhanced Context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                Conversion Rate
              </div>
              <div className="text-white font-bold">
                {summary.conversionRate
                  ? `${summary.conversionRate.toFixed(1)}%`
                  : "0%"}
              </div>
              <div className="text-white/40 text-xs mt-1">
                Actual / (Actual + Lost)
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                At-Risk Revenue
              </div>
              <div className="text-white font-bold">
                {summary.atRiskRevenue
                  ? formatCurrency(summary.atRiskRevenue)
                  : "$0.00"}
              </div>
              <div className="text-white/40 text-xs mt-1">
                Unpaid {">"}7 days
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                Gross Potential
              </div>
              <div className="text-white font-bold">
                {summary.totalGrossRevenue
                  ? formatCurrency(summary.totalGrossRevenue)
                  : "$0.00"}
              </div>
              <div className="text-white/40 text-xs mt-1">
                Actual + Potential
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                Avg Paid Value
              </div>
              <div className="text-white font-bold">
                {summary.averagePaidBookingValue
                  ? formatCurrency(summary.averagePaidBookingValue)
                  : "$0.00"}
              </div>
              <div className="text-white/40 text-xs mt-1">Per paid booking</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
