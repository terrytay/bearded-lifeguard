import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";
import { ExportService } from "../../../../../lib/export-service";
import {
  ReportType,
  ExportRequest,
  BookingReportData,
  LifeguardReportData,
  ReportSummary,
  ReportQueryFilters,
  normalizeReportRange,
  computeProration,
  buildProrationNote,
} from "../../../../../lib/report-types";

// Apply the multi-select filters to a bookings query (mirrors route.ts).
// Non-empty arrays become `.in()` constraints; empty arrays are skipped.
function applyBookingFilters(query: any, filters?: ReportQueryFilters) {
  if (filters?.status?.length) query = query.in("status", filters.status);
  if (filters?.paymentStatus?.length)
    query = query.in("payment_status", filters.paymentStatus);
  if (filters?.serviceType?.length)
    query = query.in("service_type", filters.serviceType);
  return query;
}

// Helper function to verify admin access
async function verifyAdmin(request: Request): Promise<boolean> {
  try {
    const supabase = await createClient();
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return false;
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return profile?.role === "admin";
  } catch (error) {
    console.error("Admin verification error:", error);
    return false;
  }
}

// POST /api/admin/reports/export - Export report data
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ExportRequest = await request.json();
    const { type, startDate, endDate, fields, format } = body;
    const filters: ReportQueryFilters = {
      status: body.status || [],
      paymentStatus: body.paymentStatus || [],
      serviceType: body.serviceType || [],
    };

    if (
      !type ||
      !startDate ||
      !endDate ||
      !fields ||
      fields.length === 0 ||
      !format
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: type, startDate, endDate, fields, format",
        },
        { status: 400 }
      );
    }

    if (
      !["bookings", "lifeguards"].includes(type) ||
      !["csv", "pdf"].includes(format)
    ) {
      return NextResponse.json(
        {
          error: "Invalid type or format",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get report data and summary
    const { data, summary } =
      type === "bookings"
        ? await generateBookingsData(supabase, startDate, endDate, fields, filters)
        : await generateLifeguardsData(supabase, startDate, endDate, fields, filters);

    // Generate export file
    if (format === "csv") {
      const csvContent = ExportService.generateCSV(data, fields, type);
      const blob = ExportService.createDownloadBlob(csvContent, "csv");

      const fileName = ExportService.generateFileName(type, "csv", {
        startDate,
        endDate,
      });

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": csvContent.length.toString(),
        },
      });
    } else if (format === "pdf") {
      const pdfBuffer = await ExportService.generatePDF(
        data,
        fields,
        type,
        summary,
        { startDate, endDate }
      );

      const fileName = ExportService.generateFileName(type, "pdf", {
        startDate,
        endDate,
      });

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": pdfBuffer.byteLength.toString(),
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate export",
      },
      { status: 500 }
    );
  }
}

async function generateBookingsData(
  supabase: any,
  startDate: string,
  endDate: string,
  fields: string[],
  filters?: ReportQueryFilters
) {
  try {
    // Normalize the requested range to naive Singapore-local, end-of-day inclusive
    const { rangeStart, rangeEnd } = normalizeReportRange(startDate, endDate);

    // Build the select query based on requested fields (excluding computed fields)
    const computedFields = [
      "lifeguards_assigned_count",
      "revenue_per_hour",
      "service_display_name",
      "actual_revenue_only",
      "is_revenue_generating",
      "revenue_status",
      "days_since_booking",
      "hours_in_period",
      "amount_in_period",
      "is_prorated",
      "proration_note",
    ];
    const selectFields = fields.filter((field) => !computedFields.includes(field));

    // Columns always needed for proration / breakdown / revenue logic, even if not displayed
    const requiredColumns = ["start_datetime", "end_datetime", "hours", "amount", "status", "payment_status", "created_at"];
    const dbColumns = Array.from(new Set([...selectFields, ...requiredColumns]));

    // Base query - bookings whose SERVICE WINDOW overlaps the period (all data, no limit)
    let query = supabase
      .from("bookings")
      .select(dbColumns.join(", "), { count: "exact" })
      .lte("start_datetime", rangeEnd)
      .gte("end_datetime", rangeStart)
      .order("start_datetime", { ascending: true });

    // Optional multi-select filters (status / payment status / service type)
    query = applyBookingFilters(query, filters);

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error("Bookings export query error:", error);
      throw error;
    }

    // Process computed fields if requested
    const processedData = await Promise.all(
      bookings.map(async (booking: any) => {
        const result = { ...booking };

        // Existing computed fields
        if (fields.includes("lifeguards_assigned_count")) {
          result.lifeguards_assigned_count =
            booking.lifeguards_assigned?.length || 0;
        }

        if (fields.includes("revenue_per_hour")) {
          result.revenue_per_hour =
            booking.hours > 0 ? booking.amount / booking.hours : 0;
        }

        if (fields.includes("service_display_name")) {
          if (booking.service_type === "others" && booking.custom_service) {
            result.service_display_name = `Custom Service: ${booking.custom_service}`;
          } else {
            const serviceNames: Record<string, string> = {
              pools: "Pool Lifeguarding",
              events: "Event Lifeguarding",
              "pool-parties": "Pool Party",
              "open-water": "Open Water",
            };
            result.service_display_name =
              serviceNames[booking.service_type] || booking.service_type;
          }
        }

        // New revenue classification fields
        const isPaid = booking.payment_status === "paid";
        const isCancelled = booking.status === "cancelled";
        const isConfirmedOrPending = ["confirmed", "pending"].includes(booking.status);
        const daysSinceBooking = Math.floor(
          (new Date().getTime() - new Date(booking.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (fields.includes("actual_revenue_only")) {
          result.actual_revenue_only =
            isPaid && !isCancelled ? booking.amount : 0;
        }

        if (fields.includes("is_revenue_generating")) {
          result.is_revenue_generating = isPaid && !isCancelled;
        }

        if (fields.includes("revenue_status")) {
          if (isCancelled) {
            result.revenue_status = "Lost";
          } else if (isPaid) {
            result.revenue_status = "Actual";
          } else if (isConfirmedOrPending && daysSinceBooking > 7) {
            result.revenue_status = "At-Risk";
          } else if (isConfirmedOrPending) {
            result.revenue_status = "Potential";
          } else {
            result.revenue_status = "Potential";
          }
        }

        if (fields.includes("days_since_booking")) {
          result.days_since_booking = daysSinceBooking;
        }

        // Payroll: prorate billed hours/amount to the selected period (overlap-based)
        const proration = computeProration(booking, rangeStart, rangeEnd);

        if (fields.includes("hours_in_period")) {
          result.hours_in_period = Number(proration.hoursInPeriod.toFixed(2));
        }

        if (fields.includes("amount_in_period")) {
          result.amount_in_period = Number(proration.amountInPeriod.toFixed(2));
        }

        if (fields.includes("is_prorated")) {
          result.is_prorated = proration.isProrated;
        }

        if (fields.includes("proration_note")) {
          result.proration_note = buildProrationNote(booking, rangeStart, rangeEnd, proration);
        }

        return result;
      })
    );

    // Calculate enhanced revenue statistics
    const actualRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.payment_status === "paid" && booking.status !== "cancelled" ? (booking.amount || 0) : 0);
    }, 0);

    const potentialRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.payment_status === "pending" && ["confirmed", "pending"].includes(booking.status) ? (booking.amount || 0) : 0);
    }, 0);

    const lostRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.status === "cancelled" ? (booking.amount || 0) : 0);
    }, 0);

    const atRiskRevenue = bookings.reduce((sum: number, booking: any) => {
      const daysSince = Math.floor((new Date().getTime() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return sum + (booking.payment_status === "pending" && ["confirmed", "pending"].includes(booking.status) && daysSince > 7 ? (booking.amount || 0) : 0);
    }, 0);

    const totalGrossRevenue = actualRevenue + potentialRevenue;
    const conversionRate = (actualRevenue + lostRevenue) > 0 ? (actualRevenue / (actualRevenue + lostRevenue)) * 100 : 0;
    
    const paidBookings = bookings.filter((booking: any) => booking.payment_status === "paid" && booking.status !== "cancelled");
    const confirmedBookings = bookings.filter((booking: any) => ["confirmed", "pending"].includes(booking.status));
    
    const averagePaidBookingValue = paidBookings.length > 0 ? actualRevenue / paidBookings.length : 0;
    const paymentCollectionRate = confirmedBookings.length > 0 ? (paidBookings.length / confirmedBookings.length) * 100 : 0;

    // Determine revenue health status
    let revenueHealthStatus: "healthy" | "attention" | "concern" = "healthy";
    const cancellationRate = bookings.length > 0 ? (bookings.filter((b: any) => b.status === "cancelled").length / bookings.length) * 100 : 0;
    
    if (paymentCollectionRate < 60 || cancellationRate > 30) {
      revenueHealthStatus = "concern";
    } else if (paymentCollectionRate < 80 || cancellationRate > 20) {
      revenueHealthStatus = "attention";
    }

    const totalHours = bookings.reduce(
      (sum: number, booking: any) => sum + (booking.hours || 0),
      0
    );

    // Payroll breakdown: prorated hours/amount split by cancelled vs non-cancelled
    let nonCancelledCount = 0, nonCancelledProratedHours = 0, nonCancelledProratedAmount = 0;
    let cancelledCount = 0, cancelledProratedHours = 0, cancelledProratedAmount = 0;
    for (const booking of bookings) {
      const p = computeProration(booking, rangeStart, rangeEnd);
      if (booking.status === "cancelled") {
        cancelledCount += 1;
        cancelledProratedHours += p.hoursInPeriod;
        cancelledProratedAmount += p.amountInPeriod;
      } else {
        nonCancelledCount += 1;
        nonCancelledProratedHours += p.hoursInPeriod;
        nonCancelledProratedAmount += p.amountInPeriod;
      }
    }

    const summary: ReportSummary = {
      totalRecords: count || 0,
      dateRange: { startDate, endDate },
      // Enhanced revenue metrics
      actualRevenue,
      potentialRevenue,
      lostRevenue,
      totalGrossRevenue,
      conversionRate,
      averagePaidBookingValue,
      paymentCollectionRate,
      revenueHealthStatus,
      atRiskRevenue,
      totalHours,
      // Payroll: cancelled vs non-cancelled prorated breakdown
      nonCancelledCount,
      nonCancelledProratedHours: Number(nonCancelledProratedHours.toFixed(2)),
      nonCancelledProratedAmount: Number(nonCancelledProratedAmount.toFixed(2)),
      cancelledCount,
      cancelledProratedHours: Number(cancelledProratedHours.toFixed(2)),
      cancelledProratedAmount: Number(cancelledProratedAmount.toFixed(2)),
      totalProratedHours: Number(nonCancelledProratedHours.toFixed(2)),
      // Legacy fields (for compatibility)
      totalRevenue: actualRevenue,
      averageBookingValue: averagePaidBookingValue,
    };

    return { data: processedData as BookingReportData[], summary };
  } catch (error) {
    console.error("Bookings export error:", error);
    throw error;
  }
}

async function generateLifeguardsData(
  supabase: any,
  startDate: string,
  endDate: string,
  fields: string[],
  filters?: ReportQueryFilters
) {
  try {
    const { rangeStart, rangeEnd } = normalizeReportRange(startDate, endDate);

    // Build the select query based on requested fields (excluding computed fields)
    const computedFields = [
      "total_assignments",
      "active_assignments",
      "total_revenue_generated",
      "avg_assignment_duration",
      "total_prorated_hours",
      "cancelled_assignments",
    ];
    const selectFields = fields.filter((field) => !computedFields.includes(field));
    const dbColumns = Array.from(new Set([...selectFields, "id", "is_active", "name"]));

    // Base query: list ALL active lifeguards (not filtered by record-creation date)
    let query = supabase
      .from("lifeguards")
      .select(dbColumns.join(", "), { count: "exact" })
      .eq("is_active", true)
      .order("name", { ascending: true });

    const { data: lifeguards, error, count } = await query;

    if (error) {
      console.error("Lifeguards export query error:", error);
      throw error;
    }

    // Fetch all bookings whose SERVICE WINDOW overlaps the period once (avoids N+1 per lifeguard)
    const needsAssignmentData = fields.some((f) => computedFields.includes(f));
    let periodBookings: any[] = [];
    if (needsAssignmentData) {
      let pbQuery = supabase
        .from("bookings")
        .select("id, amount, hours, status, lifeguards_assigned, start_datetime, end_datetime")
        .lte("start_datetime", rangeEnd)
        .gte("end_datetime", rangeStart);
      pbQuery = applyBookingFilters(pbQuery, filters);
      const { data: pb } = await pbQuery;
      periodBookings = pb || [];
    }

    // Process computed fields if requested
    const processedData = lifeguards.map((lifeguard: any) => {
      const result = { ...lifeguard };

      if (needsAssignmentData) {
        const assignedBookings = periodBookings.filter((booking: any) =>
          booking.lifeguards_assigned?.includes(lifeguard.id)
        );
        const nonCancelled = assignedBookings.filter((b: any) => b.status !== "cancelled");

        if (fields.includes("total_assignments")) {
          result.total_assignments = assignedBookings.length;
        }

        if (fields.includes("active_assignments")) {
          result.active_assignments = assignedBookings.filter(
            (booking: any) => ["confirmed", "paid"].includes(booking.status)
          ).length;
        }

        if (fields.includes("cancelled_assignments")) {
          result.cancelled_assignments = assignedBookings.filter(
            (b: any) => b.status === "cancelled"
          ).length;
        }

        if (fields.includes("total_revenue_generated")) {
          result.total_revenue_generated = nonCancelled.reduce(
            (sum: number, booking: any) => sum + (booking.amount || 0),
            0
          );
        }

        // Prorated in-period hours from non-cancelled assignments (payroll)
        const proratedHours = nonCancelled.reduce(
          (sum: number, booking: any) =>
            sum + computeProration(booking, rangeStart, rangeEnd).hoursInPeriod,
          0
        );

        if (fields.includes("total_prorated_hours")) {
          result.total_prorated_hours = Number(proratedHours.toFixed(2));
        }

        if (fields.includes("avg_assignment_duration")) {
          result.avg_assignment_duration =
            nonCancelled.length > 0
              ? Number((proratedHours / nonCancelled.length).toFixed(2))
              : 0;
        }
      }

      return result;
    });

    // Calculate summary statistics
    const totalActiveLifeguards = lifeguards.filter(
      (lg: any) => lg.is_active
    ).length;

    // Source for assignment/payroll totals: reuse the pre-fetched overlapping bookings
    let assignmentSource = periodBookings;
    if (!needsAssignmentData) {
      let asQuery = supabase
        .from("bookings")
        .select("lifeguards_assigned, status, hours, amount, start_datetime, end_datetime")
        .lte("start_datetime", rangeEnd)
        .gte("end_datetime", rangeStart);
      asQuery = applyBookingFilters(asQuery, filters);
      const { data: pb } = await asQuery;
      assignmentSource = pb || [];
    }

    const totalAssignments = assignmentSource.reduce(
      (sum: number, booking: any) =>
        sum + (booking.lifeguards_assigned?.length || 0),
      0
    );

    // Payroll: total prorated hours across non-cancelled assignments (per assigned lifeguard)
    let totalProratedHours = 0;
    for (const booking of assignmentSource) {
      if (booking.status === "cancelled") continue;
      const assignedCount = booking.lifeguards_assigned?.length || 0;
      if (assignedCount === 0) continue;
      totalProratedHours +=
        computeProration(booking, rangeStart, rangeEnd).hoursInPeriod * assignedCount;
    }

    const averageAssignmentsPerLifeguard =
      lifeguards.length > 0 ? totalAssignments / lifeguards.length : 0;

    const summary: ReportSummary = {
      totalRecords: count || 0,
      dateRange: { startDate, endDate },
      totalActiveLifeguards,
      totalAssignments,
      averageAssignmentsPerLifeguard,
      totalProratedHours: Number(totalProratedHours.toFixed(2)),
    };

    return { data: processedData as LifeguardReportData[], summary };
  } catch (error) {
    console.error("Lifeguards export error:", error);
    throw error;
  }
}
