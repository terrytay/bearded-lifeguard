import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { SingaporeTime } from "../../../../lib/singapore-time";

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

// GET /api/admin/reports - Generate report data
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type') as 'bookings' | 'lifeguards';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const fields = url.searchParams.get('fields')?.split(',') || [];

    if (!type || !startDate || !endDate || fields.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required parameters: type, startDate, endDate, fields' 
      }, { status: 400 });
    }

    const supabase = await createClient();

    if (type === 'bookings') {
      return await generateBookingsReport(supabase, startDate, endDate, fields);
    } else if (type === 'lifeguards') {
      return await generateLifeguardsReport(supabase, startDate, endDate, fields);
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate report' 
    }, { status: 500 });
  }
}

async function generateBookingsReport(supabase: any, startDate: string, endDate: string, fields: string[]) {
  try {
    // Build the select query based on requested fields (excluding computed fields)
    const selectFields = fields.filter(field => 
      !['lifeguards_assigned_count', 'revenue_per_hour', 'service_display_name', 'actual_revenue_only', 'is_revenue_generating', 'revenue_status', 'days_since_booking'].includes(field)
    );
    
    // Base query
    let query = supabase
      .from('bookings')
      .select(selectFields.join(', '), { count: 'exact' })
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Bookings query error:', error);
      throw error;
    }

    // Process computed fields if requested
    const processedData = await Promise.all(bookings.map(async (booking: any) => {
      const result = { ...booking };

      // Existing computed fields
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

      // New revenue classification fields
      const isPaid = booking.payment_status === 'paid';
      const isCancelled = booking.status === 'cancelled';
      const isConfirmedOrPending = ['confirmed', 'pending'].includes(booking.status);
      const daysSinceBooking = Math.floor((new Date().getTime() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60 * 24));

      if (fields.includes('actual_revenue_only')) {
        result.actual_revenue_only = (isPaid && !isCancelled) ? booking.amount : 0;
      }

      if (fields.includes('is_revenue_generating')) {
        result.is_revenue_generating = isPaid && !isCancelled;
      }

      if (fields.includes('revenue_status')) {
        if (isCancelled) {
          result.revenue_status = 'Lost';
        } else if (isPaid) {
          result.revenue_status = 'Actual';
        } else if (isConfirmedOrPending && daysSinceBooking > 7) {
          result.revenue_status = 'At-Risk';
        } else if (isConfirmedOrPending) {
          result.revenue_status = 'Potential';
        } else {
          result.revenue_status = 'Potential';
        }
      }

      if (fields.includes('days_since_booking')) {
        result.days_since_booking = daysSinceBooking;
      }

      return result;
    }));

    // Calculate enhanced revenue statistics
    const actualRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.payment_status === 'paid' && booking.status !== 'cancelled' ? (booking.amount || 0) : 0);
    }, 0);

    const potentialRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.payment_status === 'pending' && ['confirmed', 'pending'].includes(booking.status) ? (booking.amount || 0) : 0);
    }, 0);

    const lostRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.status === 'cancelled' ? (booking.amount || 0) : 0);
    }, 0);

    const atRiskRevenue = bookings.reduce((sum: number, booking: any) => {
      const daysSince = Math.floor((new Date().getTime() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return sum + (booking.payment_status === 'pending' && ['confirmed', 'pending'].includes(booking.status) && daysSince > 7 ? (booking.amount || 0) : 0);
    }, 0);

    const totalGrossRevenue = actualRevenue + potentialRevenue;
    const conversionRate = (actualRevenue + lostRevenue) > 0 ? (actualRevenue / (actualRevenue + lostRevenue)) * 100 : 0;
    
    const paidBookings = bookings.filter((booking: any) => booking.payment_status === 'paid' && booking.status !== 'cancelled');
    const confirmedBookings = bookings.filter((booking: any) => ['confirmed', 'pending'].includes(booking.status));
    
    const averagePaidBookingValue = paidBookings.length > 0 ? actualRevenue / paidBookings.length : 0;
    const paymentCollectionRate = confirmedBookings.length > 0 ? (paidBookings.length / confirmedBookings.length) * 100 : 0;

    // Determine revenue health status
    let revenueHealthStatus: 'healthy' | 'attention' | 'concern' = 'healthy';
    const cancellationRate = bookings.length > 0 ? (bookings.filter((b: any) => b.status === 'cancelled').length / bookings.length) * 100 : 0;
    
    if (paymentCollectionRate < 60 || cancellationRate > 30) {
      revenueHealthStatus = 'concern';
    } else if (paymentCollectionRate < 80 || cancellationRate > 20) {
      revenueHealthStatus = 'attention';
    }

    const totalHours = bookings.reduce((sum: number, booking: any) => sum + (booking.hours || 0), 0);

    const summary = {
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
      // Legacy fields (for compatibility)
      totalRevenue: actualRevenue,
      averageBookingValue: averagePaidBookingValue,
    };

    return NextResponse.json({
      data: processedData,
      totalCount: count || 0,
      summary,
    });

  } catch (error) {
    console.error('Bookings report error:', error);
    throw error;
  }
}

async function generateLifeguardsReport(supabase: any, startDate: string, endDate: string, fields: string[]) {
  try {
    // Build the select query based on requested fields (excluding computed fields)
    const selectFields = fields.filter(field => 
      !['total_assignments', 'active_assignments', 'total_revenue_generated', 'avg_assignment_duration'].includes(field)
    );
    
    // Base query for lifeguards
    let query = supabase
      .from('lifeguards')
      .select(selectFields.join(', '), { count: 'exact' })
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    const { data: lifeguards, error, count } = await query;

    if (error) {
      console.error('Lifeguards query error:', error);
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

    const summary = {
      totalRecords: count || 0,
      dateRange: { startDate, endDate },
      totalActiveLifeguards,
      totalAssignments,
      averageAssignmentsPerLifeguard,
    };

    return NextResponse.json({
      data: processedData,
      totalCount: count || 0,
      summary,
    });

  } catch (error) {
    console.error('Lifeguards report error:', error);
    throw error;
  }
}