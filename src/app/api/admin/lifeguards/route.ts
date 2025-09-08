import { NextResponse } from "next/server";
import { LifeguardService } from "../../../../lib/lifeguard-service";
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

// GET /api/admin/lifeguards - Get all lifeguards
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
    const activeOnly = url.searchParams.get('active_only') === 'true';

    let lifeguards;
    if (search) {
      lifeguards = await LifeguardService.searchLifeguards(search);
    } else if (activeOnly) {
      lifeguards = await LifeguardService.getActiveLifeguards();
    } else {
      const offset = (page - 1) * limit;
      lifeguards = await LifeguardService.getAllLifeguards(limit, offset);
    }

    const stats = await LifeguardService.getLifeguardStats();

    return NextResponse.json({ 
      lifeguards, 
      stats,
      page,
      limit,
      hasMore: lifeguards.length === limit 
    });
  } catch (error) {
    console.error('Error fetching lifeguards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lifeguards' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lifeguards - Create new lifeguard
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, contact_number, is_active = true } = body;

    // Validate required fields
    if (!name || !contact_number) {
      return NextResponse.json(
        { error: 'Name and contact number are required' },
        { status: 400 }
      );
    }

    // Validate contact number format (basic validation)
    const phoneRegex = /^\+65\s?\d{4}\s?\d{4}$|^\d{8}$/;
    if (!phoneRegex.test(contact_number.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid contact number format' },
        { status: 400 }
      );
    }

    const lifeguard = await LifeguardService.createLifeguard({
      name: name.trim(),
      contact_number: contact_number.trim(),
      is_active,
    });

    return NextResponse.json(lifeguard, { status: 201 });
  } catch (error) {
    console.error('Error creating lifeguard:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create lifeguard' },
      { status: 500 }
    );
  }
}