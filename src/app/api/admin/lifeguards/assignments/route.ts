import { NextResponse } from "next/server";
import { LifeguardService } from "../../../../../lib/lifeguard-service";
import { createClient } from "../../../../../lib/supabase/server";

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

// GET /api/admin/lifeguards/assignments - Get available lifeguards for a booking
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const bookingId = url.searchParams.get('booking_id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'booking_id parameter is required' },
        { status: 400 }
      );
    }

    const availableLifeguards = await LifeguardService.getAvailableLifeguardsForBooking(bookingId);
    const assignedLifeguards = await LifeguardService.getLifeguardsByBooking(bookingId);

    return NextResponse.json({ 
      available: availableLifeguards,
      assigned: assignedLifeguards
    });
  } catch (error) {
    console.error('Error fetching available lifeguards:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch available lifeguards' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lifeguards/assignments - Assign lifeguards to booking
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, lifeguard_ids } = body;

    if (!booking_id || !Array.isArray(lifeguard_ids)) {
      return NextResponse.json(
        { error: 'booking_id and lifeguard_ids (array) are required' },
        { status: 400 }
      );
    }

    const updatedBooking = await LifeguardService.assignLifeguardsToBooking(booking_id, lifeguard_ids);
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error assigning lifeguards:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign lifeguards' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/lifeguards/assignments - Unassign lifeguard from booking
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const bookingId = url.searchParams.get('booking_id');
    const lifeguardId = url.searchParams.get('lifeguard_id');

    if (!bookingId || !lifeguardId) {
      return NextResponse.json(
        { error: 'booking_id and lifeguard_id parameters are required' },
        { status: 400 }
      );
    }

    const updatedBooking = await LifeguardService.unassignLifeguardFromBooking(bookingId, lifeguardId);
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error unassigning lifeguard:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unassign lifeguard' },
      { status: 500 }
    );
  }
}