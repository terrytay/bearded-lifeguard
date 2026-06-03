"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardLayout from "../components/DashboardLayout";
import ReportTypeSelector from "./components/ReportTypeSelector";
import DateRangePicker from "./components/DateRangePicker";
import FilterPanel from "./components/FilterPanel";
import FieldSelector from "./components/FieldSelector";
import DataPreview from "./components/DataPreview";
import ExportActions from "./components/ExportActions";
import ReportStats from "./components/ReportStats";
import BackToTopButton from "../components/BackToTop";

import {
  ReportType,
  ReportQueryFilters,
  BookingReportFields,
  LifeguardReportFields,
  DEFAULT_BOOKING_FIELDS,
  DEFAULT_LIFEGUARD_FIELDS,
  getDateRangePresets,
  ReportResponse,
} from "@/lib/report-types";

// Format a Date as a Singapore-local date-only string (YYYY-MM-DD) using local
// calendar components. The admin runs in SGT, so this matches how booking
// start/end times are stored and avoids the UTC shift that .toISOString() causes.
function toSgtDateString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<ReportType>("bookings");
  const [dateRange, setDateRange] = useState(() => {
    const presets = getDateRangePresets();
    const thisMonth = presets.find((p) => p.value === "thisMonth");
    return {
      startDate: thisMonth?.startDate || new Date(),
      endDate: thisMonth?.endDate || new Date(),
    };
  });
  const [filters, setFilters] = useState<ReportQueryFilters>({
    status: [],
    paymentStatus: [],
    serviceType: [],
  });
  const [bookingFields, setBookingFields] = useState<BookingReportFields>(
    DEFAULT_BOOKING_FIELDS
  );
  const [lifeguardFields, setLifeguardFields] = useState<LifeguardReportFields>(
    DEFAULT_LIFEGUARD_FIELDS
  );
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadReportData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reportType, dateRange, filters, bookingFields, lifeguardFields]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/admin/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Admin access required");
      await supabase.auth.signOut();
      window.location.href = "/";
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const selectedFieldList = () => {
    const currentFields =
      reportType === "bookings" ? bookingFields : lifeguardFields;
    return Object.entries(currentFields)
      .filter(([, selected]) => selected)
      .map(([field]) => field);
  };

  const loadReportData = async () => {
    if (!user) return;

    setLoadingReport(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const params = new URLSearchParams({
        type: reportType,
        startDate: toSgtDateString(dateRange.startDate),
        endDate: toSgtDateString(dateRange.endDate),
        fields: selectedFieldList().join(","),
        format: "json",
      });
      if (filters.status?.length) params.set("status", filters.status.join(","));
      if (filters.paymentStatus?.length)
        params.set("paymentStatus", filters.paymentStatus.join(","));
      if (filters.serviceType?.length)
        params.set("serviceType", filters.serviceType.join(","));

      const response = await fetch(`/api/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data: ReportResponse = await response.json();
        setReportData(data);
      } else {
        console.error("Failed to load report data");
        setReportData(null);
      }
    } catch (error) {
      console.error("Report load error:", error);
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    if (!user || !reportData) return;

    setProcessing(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          type: reportType,
          startDate: toSgtDateString(dateRange.startDate),
          endDate: toSgtDateString(dateRange.endDate),
          fields: selectedFieldList(),
          format,
          status: filters.status || [],
          paymentStatus: filters.paymentStatus || [],
          serviceType: filters.serviceType || [],
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${reportType}_report_${toSgtDateString(
          dateRange.startDate
        )}_${toSgtDateString(dateRange.endDate)}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Export failed. Please try again.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <div className="bg-white border border-ink/12 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-ink/15 border-t-signal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-soft text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      newBookingsCount={0}
      onSignOut={signOut}
      processing={processing}
    >
      <BackToTopButton />

      <div className="p-3 md:p-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Header + report type */}
          <div className="console-in">
            <div className="border-b-2 border-ink pb-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Payroll &amp; analytics · by service date
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-none mt-1">
                Reports
              </h1>
            </div>
            <div className="mt-4">
              <ReportTypeSelector
                reportType={reportType}
                onReportTypeChange={setReportType}
              />
            </div>
          </div>

          {/* Date range */}
          <div
            className="console-in bg-white border border-ink/12 rounded-2xl p-4"
            style={{ animationDelay: "60ms" }}
          >
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateRangeChange={(startDate, endDate) =>
                setDateRange({ startDate, endDate })
              }
            />
          </div>

          {/* Filters + Columns */}
          <div
            className="console-in grid grid-cols-1 lg:grid-cols-2 gap-4"
            style={{ animationDelay: "120ms" }}
          >
            <FilterPanel filters={filters} onChange={setFilters} />
            <FieldSelector
              reportType={reportType}
              bookingFields={bookingFields}
              lifeguardFields={lifeguardFields}
              onBookingFieldsChange={setBookingFields}
              onLifeguardFieldsChange={setLifeguardFields}
            />
          </div>

          {/* Summary */}
          {reportData && (
            <div className="console-in" style={{ animationDelay: "180ms" }}>
              <ReportStats reportType={reportType} summary={reportData.summary} />
            </div>
          )}

          {/* Data preview */}
          <div className="console-in" style={{ animationDelay: "240ms" }}>
            <DataPreview
              reportType={reportType}
              data={reportData?.data || []}
              loading={loadingReport}
              fields={reportType === "bookings" ? bookingFields : lifeguardFields}
            />
          </div>

          {/* Export bar — fixed bottom on mobile, inline on desktop */}
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:inset-auto md:z-auto md:bg-white md:border md:border-ink/12 md:rounded-2xl md:px-5 md:py-4 md:pb-4 md:backdrop-blur-none console-in"
            style={{ animationDelay: "300ms" }}
          >
            <ExportActions
              onExport={handleExport}
              disabled={!reportData || loadingReport}
              totalRecords={reportData?.totalCount || 0}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
