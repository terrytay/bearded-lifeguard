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

const toneText: Record<string, string> = {
  neutral: "text-ink",
  good: "text-sea",
  warn: "text-ochre",
  bad: "text-signal",
};

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
  return (
    <div className="bg-white border border-ink/12 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-1">
        {label}
      </div>
      <div
        className={`font-display text-xl md:text-2xl font-semibold tabular-nums leading-none ${toneText[tone]}`}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-ink-soft mt-1">{sub}</div>}
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
    <div className="space-y-3">
      {/* Inverted masthead hero */}
      <div className="bg-ink text-paper rounded-2xl p-5 md:p-7 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-signal" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-paper/60">
            Payroll · {periodLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-paper/15">
          {hero.map((h, i) => (
            <div key={i} className={`min-w-0 ${i === 0 ? "pr-3" : "px-3"}`}>
              <div className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tabular-nums leading-[0.95] text-paper truncate">
                {h.value}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.16em] text-paper/55 mt-2">
                {h.label}
              </div>
            </div>
          ))}
        </div>
        {reportType === "bookings" && (
          <p className="text-[11px] text-paper/45 mt-4 leading-relaxed max-w-2xl">
            Hours &amp; amounts are prorated to the portion of each booking inside
            the selected range. Cancelled bookings appear below but are excluded
            from payable totals.
          </p>
        )}
      </div>

      {/* Bookings detail */}
      {reportType === "bookings" && (
        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
              Prorated breakdown
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
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
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                Revenue
              </div>
              {summary.revenueHealthStatus && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                    summary.revenueHealthStatus === "healthy"
                      ? "text-sea border-sea/40 bg-sea/10"
                      : summary.revenueHealthStatus === "attention"
                      ? "text-ochre border-ochre/40 bg-ochre/10"
                      : "text-signal border-signal/40 bg-signal/10"
                  }`}
                >
                  {summary.revenueHealthStatus === "healthy"
                    ? "Healthy"
                    : summary.revenueHealthStatus === "attention"
                    ? "Attention"
                    : "Concern"}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
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

      {/* Lifeguards detail */}
      {reportType === "lifeguards" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Metric label="Records" value={fmtNum(summary.totalRecords)} />
          <Metric label="Active guards" value={fmtNum(summary.totalActiveLifeguards)} tone="good" />
          <Metric label="Assignments" value={fmtNum(summary.totalAssignments)} />
          <Metric
            label="Avg / guard"
            value={(summary.averageAssignmentsPerLifeguard || 0).toFixed(1)}
          />
        </div>
      )}
    </div>
  );
}
