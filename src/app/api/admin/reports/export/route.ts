import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";
import { ExportService } from "../../../../../lib/export-service";
import {
  ReportType,
  ExportRequest,
  BookingReportData,
  LifeguardReportData,
  ReportSummary,
} from "../../../../../lib/report-types";

// Helper function to verify admin access
async function verifyAdmin(request: Request): Promise<boolean> {
  try {
    const supabase = await createClient();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return false;
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

// POST /api/admin/reports/export - Export report data
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ExportRequest = await request.json();
    const { type, startDate, endDate, fields, format } = body;

    if (!type || !startDate || !endDate || !fields || fields.length === 0 || !format) {
      return NextResponse.json({ 
        error: 'Missing required parameters: type, startDate, endDate, fields, format' 
      }, { status: 400 });
    }

    if (!['bookings', 'lifeguards'].includes(type) || !['csv', 'pdf'].includes(format)) {
      return NextResponse.json({ 
        error: 'Invalid type or format' 
      }, { status: 400 });
    }

    const supabase = await createClient();

    // Get report data and summary
    const { data, summary } = type === 'bookings' 
      ? await generateBookingsData(supabase, startDate, endDate, fields)
      : await generateLifeguardsData(supabase, startDate, endDate, fields);

    // Generate export file
    if (format === 'csv') {
      const csvContent = ExportService.generateCSV(data, fields, type);
      const blob = ExportService.createDownloadBlob(csvContent, 'csv');
      
      const fileName = ExportService.generateFileName(type, 'csv', { startDate, endDate });

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': csvContent.length.toString(),
        },
      });

    } else if (format === 'pdf') {
      const pdfBuffer = await ExportService.generatePDF(
        data, 
        fields, 
        type, 
        summary,
        { startDate, endDate }
      );
      
      const fileName = ExportService.generateFileName(type, 'pdf', { startDate, endDate });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdfBuffer.byteLength.toString(),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate export' 
    }, { status: 500 });
  }
}

async function generateBookingsData(supabase: any, startDate: string, endDate: string, fields: string[]) {
  try {
    // Build the select query based on requested fields
    const selectFields = fields.filter(field => 
      !['lifeguards_assigned_count', 'revenue_per_hour', 'service_display_name'].includes(field)
    );
    
    // Base query - get ALL data for export (no limit)
    let query = supabase
      .from('bookings')
      .select(selectFields.join(', '), { count: 'exact' })
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Bookings export query error:', error);
      throw error;
    }

    // Process computed fields if requested
    const processedData = await Promise.all(bookings.map(async (booking: any) => {
      const result = { ...booking };

      // Add computed fields
      if (fields.includes('lifeguards_assigned_count')) {
        result.lifeguards_assigned_count = booking.lifeguards_assigned?.length || 0;
      }

      if (fields.includes('revenue_per_hour')) {
        result.revenue_per_hour = booking.hours > 0 ? booking.amount / booking.hours : 0;
      }

      if (fields.includes('service_display_name')) {
        if (booking.service_type === 'others' && booking.custom_service) {
          result.service_display_name = `Custom Service: ${booking.custom_service}`;
        } else {
          const serviceNames: Record<string, string> = {
            pools: "Pool Lifeguarding",
            events: "Event Lifeguarding",
            "pool-parties": "Pool Party",
            "open-water": "Open Water",
          };
          result.service_display_name = serviceNames[booking.service_type] || booking.service_type;
        }
      }

      return result;
    }));

    // Calculate summary statistics
    const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + (booking.amount || 0), 0);
    const totalHours = bookings.reduce((sum: number, booking: any) => sum + (booking.hours || 0), 0);
    const averageBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;

    const summary: ReportSummary = {
      totalRecords: count || 0,
      dateRange: { startDate, endDate },
      totalRevenue,
      averageBookingValue,
      totalHours,
    };

    return { data: processedData as BookingReportData[], summary };

  } catch (error) {
    console.error('Bookings export error:', error);
    throw error;
  }
}

async function generateLifeguardsData(supabase: any, startDate: string, endDate: string, fields: string[]) {
  try {
    // Build the select query based on requested fields (excluding computed fields)
    const selectFields = fields.filter(field => 
      !['total_assignments', 'active_assignments', 'total_revenue_generated', 'avg_assignment_duration'].includes(field)
    );
    
    // Base query for lifeguards - get ALL data for export (no limit)
    let query = supabase
      .from('lifeguards')
      .select(selectFields.join(', '), { count: 'exact' })
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    const { data: lifeguards, error, count } = await query;

    if (error) {
      console.error('Lifeguards export query error:', error);
      throw error;
    }

    // Process computed fields if requested
    const processedData = await Promise.all(lifeguards.map(async (lifeguard: any) => {
      const result = { ...lifeguard };

      // Get assignment data for computed fields
      if (fields.some(f => ['total_assignments', 'active_assignments', 'total_revenue_generated', 'avg_assignment_duration'].includes(f))) {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id, amount, hours, status, lifeguards_assigned')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        // Filter bookings where this lifeguard is assigned
        const assignedBookings = bookings?.filter((booking: any) => 
          booking.lifeguards_assigned?.includes(lifeguard.id)
        ) || [];

        if (fields.includes('total_assignments')) {
          result.total_assignments = assignedBookings.length;
        }

        if (fields.includes('active_assignments')) {
          result.active_assignments = assignedBookings.filter((booking: any) => 
            ['confirmed', 'paid'].includes(booking.status)
          ).length;
        }

        if (fields.includes('total_revenue_generated')) {
          result.total_revenue_generated = assignedBookings.reduce((sum: number, booking: any) => 
            sum + (booking.amount || 0), 0
          );
        }

        if (fields.includes('avg_assignment_duration')) {
          const totalHours = assignedBookings.reduce((sum: number, booking: any) => 
            sum + (booking.hours || 0), 0
          );
          result.avg_assignment_duration = assignedBookings.length > 0 
            ? totalHours / assignedBookings.length 
            : 0;
        }
      }

      return result;
    }));

    // Calculate summary statistics
    const totalActiveLifeguards = lifeguards.filter((lg: any) => lg.is_active).length;
    
    // Get total assignments across all lifeguards in the date range
    const { data: allBookings } = await supabase
      .from('bookings')
      .select('lifeguards_assigned')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const totalAssignments = allBookings?.reduce((sum: number, booking: any) => 
      sum + (booking.lifeguards_assigned?.length || 0), 0
    ) || 0;

    const averageAssignmentsPerLifeguard = lifeguards.length > 0 
      ? totalAssignments / lifeguards.length 
      : 0;

    const summary: ReportSummary = {
      totalRecords: count || 0,
      dateRange: { startDate, endDate },
      totalActiveLifeguards,
      totalAssignments,
      averageAssignmentsPerLifeguard,
    };

    return { data: processedData as LifeguardReportData[], summary };

  } catch (error) {
    console.error('Lifeguards export error:', error);
    throw error;
  }
}