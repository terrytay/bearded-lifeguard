import { NextResponse } from "next/server";
import { BookingService } from "../../../../lib/booking-service";
import { createClient } from "../../../../lib/supabase/server";

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

// GET /api/admin/bookings - Get all bookings
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search');

    let bookings;
    if (search) {
      bookings = await BookingService.searchBookings(search);
    } else {
      const offset = (page - 1) * limit;
      bookings = await BookingService.getAllBookings(limit, offset);
    }

    const unviewedCount = await BookingService.getUnviewedCount();

    return NextResponse.json({ 
      bookings, 
      unviewedCount,
      page,
      limit,
      hasMore: bookings.length === limit 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}