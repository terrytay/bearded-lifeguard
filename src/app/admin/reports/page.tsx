"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardLayout from "../components/DashboardLayout";
import ReportTypeSelector from "./components/ReportTypeSelector";
import DateRangePicker from "./components/DateRangePicker";
import FieldSelector from "./components/FieldSelector";
import DataPreview from "./components/DataPreview";
import ExportActions from "./components/ExportActions";
import ReportStats from "./components/ReportStats";
import BackToTopButton from "../components/BackToTop";

import {
  ReportType,
  ReportFilters,
  BookingReportFields,
  LifeguardReportFields,
  DEFAULT_BOOKING_FIELDS,
  DEFAULT_LIFEGUARD_FIELDS,
  getDateRangePresets,
  ReportResponse,
  BookingReportData,
  LifeguardReportData,
} from "@/lib/report-types";

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<ReportType>('bookings');
  const [dateRange, setDateRange] = useState(() => {
    const presets = getDateRangePresets();
    return {
      startDate: presets.find(p => p.value === 'thisMonth')?.startDate || new Date(),
      endDate: presets.find(p => p.value === 'thisMonth')?.endDate || new Date(),
    };
  });
  const [bookingFields, setBookingFields] = useState<BookingReportFields>(DEFAULT_BOOKING_FIELDS);
  const [lifeguardFields, setLifeguardFields] = useState<LifeguardReportFields>(DEFAULT_LIFEGUARD_FIELDS);
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
  }, [user, reportType, dateRange, bookingFields, lifeguardFields]);

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

  const loadReportData = async () => {
    if (!user) return;

    setLoadingReport(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentFields = reportType === 'bookings' ? bookingFields : lifeguardFields;
      const selectedFields = Object.entries(currentFields)
        .filter(([_, selected]) => selected)
        .map(([field, _]) => field);

      const params = new URLSearchParams({
        type: reportType,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        fields: selectedFields.join(','),
        format: 'json',
      });

      const response = await fetch(`/api/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data: ReportResponse = await response.json();
        setReportData(data);
      } else {
        console.error('Failed to load report data');
        setReportData(null);
      }
    } catch (error) {
      console.error("Report load error:", error);
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!user || !reportData) return;

    setProcessing(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentFields = reportType === 'bookings' ? bookingFields : lifeguardFields;
      const selectedFields = Object.entries(currentFields)
        .filter(([_, selected]) => selected)
        .map(([field, _]) => field);

      const response = await fetch('/api/admin/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          type: reportType,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          fields: selectedFields,
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType}_report_${dateRange.startDate.toISOString().split('T')[0]}_${dateRange.endDate.toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Export failed. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
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

      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Reports & Analytics
                </h1>
                <p className="text-white/60 text-sm md:text-base">
                  Generate detailed reports for bookings and lifeguards
                </p>
              </div>
            </div>

            {/* Report Type Selector */}
            <ReportTypeSelector
              reportType={reportType}
              onReportTypeChange={setReportType}
            />
          </div>

          {/* Configuration Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range Picker */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateRangeChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
              />
            </div>

            {/* Field Selector */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <FieldSelector
                reportType={reportType}
                bookingFields={bookingFields}
                lifeguardFields={lifeguardFields}
                onBookingFieldsChange={setBookingFields}
                onLifeguardFieldsChange={setLifeguardFields}
              />
            </div>
          </div>

          {/* Report Stats */}
          {reportData && (
            <ReportStats
              reportType={reportType}
              summary={reportData.summary}
            />
          )}

          {/* Export Actions */}
          <ExportActions
            onExport={handleExport}
            disabled={!reportData || loadingReport}
            totalRecords={reportData?.totalCount || 0}
          />

          {/* Data Preview */}
          <DataPreview
            reportType={reportType}
            data={reportData?.data || []}
            loading={loadingReport}
            fields={reportType === 'bookings' ? bookingFields : lifeguardFields}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}