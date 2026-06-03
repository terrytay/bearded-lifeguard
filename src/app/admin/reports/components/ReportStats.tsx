"use client";

import { ReportType, ReportSummary } from "@/lib/report-types";

interface ReportStatsProps {
  reportType: ReportType;
  summary: ReportSummary;
}

const fmtCurrency = (n: number | undefined) =>
  `$${(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const fmtHours = (n: number | undefined) => `${(n || 0).toFixed(1)}h`;
const fmtNum = (n: number | undefined) => (n || 0).toLocaleString();
const fmtPct = (n: number | undefined) => `${(n || 0).toFixed(1)}%`;

// Small labelled metric tile
function Metric({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  const toneRing =
    tone === "good"
      ? "border-emerald-400/20"
      : tone === "warn"
      ? "border-amber-400/20"
      : tone === "bad"
      ? "border-rose-400/20"
      : "border-white/10";
  const toneText =
    tone === "good"
      ? "text-emerald-200"
      : tone === "warn"
      ? "text-amber-200"
      : tone === "bad"
      ? "text-rose-200"
      : "text-white";
  return (
    <div className={`bg-white/[0.03] border ${toneRing} rounded-xl p-3`}>
      <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-1">
        {label}
      </div>
      <div className={`text-base md:text-lg font-bold tabular-nums ${toneText}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/35 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ReportStats({ reportType, summary }: ReportStatsProps) {
  const periodLabel = (() => {
    try {
      const s = new Date(summary.dateRange.startDate);
      const e = new Date(summary.dateRange.endDate);
      const opt: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
      return `${s.toLocaleDateString("en-GB", opt)} → ${e.toLocaleDateString(
        "en-GB",
        { ...opt, year: "numeric" }
      )}`;
    } catch {
      return "";
    }
  })();

  // Hero metrics differ by report type
  const hero =
    reportType === "bookings"
      ? [
          { value: fmtHours(summary.nonCancelledProratedHours), label: "Payroll hours" },
          { value: fmtCurrency(summary.nonCancelledProratedAmount), label: "In-period amount" },
          { value: fmtNum(summary.nonCancelledCount), label: "Payable events" },
        ]
      : [
          { value: fmtHours(summary.totalProratedHours), label: "Payroll hours" },
          { value: fmtNum(summary.totalActiveLifeguards), label: "Active guards" },
          { value: fmtNum(summary.totalAssignments), label: "Assignments" },
        ];

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Hero */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 bg-gradient-to-b from-[#FF6633]/[0.08] to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6633] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#FF6633]">
            Payroll · {periodLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {hero.map((h, i) => (
            <div key={i} className="min-w-0">
              <div className="text-xl sm:text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-white truncate">
                {h.value}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.14em] text-white/45 mt-1">
                {h.label}
              </div>
            </div>
          ))}
        </div>
        {reportType === "bookings" && (
          <div className="text-[11px] text-white/35 mt-3 leading-relaxed">
            Hours &amp; amounts are prorated to the portion of each booking inside
            the selected range. Cancelled bookings are shown below but excluded
            from payable totals.
          </div>
        )}
      </div>

      {/* Bookings: cancelled vs non-cancelled + revenue */}
      {reportType === "bookings" && (
        <div className="px-4 md:px-6 py-4 border-t border-white/10 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-2">
              Prorated breakdown
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
              <Metric
                label="Payable"
                value={fmtHours(summary.nonCancelledProratedHours)}
                sub={`${fmtNum(summary.nonCancelledCount)} bookings`}
                tone="good"
              />
              <Metric
                label="Payable value"
                value={fmtCurrency(summary.nonCancelledProratedAmount)}
                tone="good"
              />
              <Metric
                label="Cancelled hrs"
                value={fmtHours(summary.cancelledProratedHours)}
                sub={`${fmtNum(summary.cancelledCount)} bookings`}
                tone="bad"
              />
              <Metric
                label="Cancelled value"
                value={fmtCurrency(summary.cancelledProratedAmount)}
                tone="bad"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                Revenue
              </div>
              {summary.revenueHealthStatus && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] border ${
                    summary.revenueHealthStatus === "healthy"
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
                      : summary.revenueHealthStatus === "attention"
                      ? "bg-amber-500/15 text-amber-200 border-amber-400/30"
                      : "bg-rose-500/15 text-rose-200 border-rose-400/30"
                  }`}
                >
                  {summary.revenueHealthStatus === "healthy"
                    ? "Healthy"
                    : summary.revenueHealthStatus === "attention"
                    ? "Needs attention"
                    : "Concern"}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
              <Metric label="Actual" value={fmtCurrency(summary.actualRevenue)} tone="good" />
              <Metric label="Potential" value={fmtCurrency(summary.potentialRevenue)} tone="warn" />
              <Metric label="Lost" value={fmtCurrency(summary.lostRevenue)} tone="bad" />
              <Metric
                label="Collection"
                value={fmtPct(summary.paymentCollectionRate)}
                tone={
                  (summary.paymentCollectionRate || 0) >= 80
                    ? "good"
                    : (summary.paymentCollectionRate || 0) >= 60
                    ? "warn"
                    : "bad"
                }
              />
              <Metric label="At-risk" value={fmtCurrency(summary.atRiskRevenue)} sub="Unpaid >7d" tone="warn" />
              <Metric label="Gross potential" value={fmtCurrency(summary.totalGrossRevenue)} />
              <Metric label="Conversion" value={fmtPct(summary.conversionRate)} />
              <Metric label="Avg paid" value={fmtCurrency(summary.averagePaidBookingValue)} />
            </div>
          </div>
        </div>
      )}

      {/* Lifeguards: secondary metrics */}
      {reportType === "lifeguards" && (
        <div className="px-4 md:px-6 py-4 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            <Metric label="Records" value={fmtNum(summary.totalRecords)} />
            <Metric label="Active guards" value={fmtNum(summary.totalActiveLifeguards)} tone="good" />
            <Metric label="Assignments" value={fmtNum(summary.totalAssignments)} />
            <Metric
              label="Avg / guard"
              value={(summary.averageAssignmentsPerLifeguard || 0).toFixed(1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
