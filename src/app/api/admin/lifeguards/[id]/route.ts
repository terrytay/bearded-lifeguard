import { NextResponse } from "next/server";
import { LifeguardService } from "../../../../../lib/lifeguard-service";
import { createClient } from "../../../../../lib/supabase/server";

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

// GET /api/admin/lifeguards/[id] - Get single lifeguard
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lifeguard = await LifeguardService.getLifeguardById(id);

    if (!lifeguard) {
      return NextResponse.json(
        { error: "Lifeguard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lifeguard });
  } catch (error) {
    console.error("Error fetching lifeguard:", error);
    return NextResponse.json(
      { error: "Failed to fetch lifeguard" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/lifeguards/[id] - Update lifeguard
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, contact_number, is_active } = body;

    // Validate contact number format if provided
    if (contact_number) {
      const phoneRegex = /^\+65\s?\d{4}\s?\d{4}$|^\d{8}$/;
      if (!phoneRegex.test(contact_number.replace(/\s/g, ""))) {
        return NextResponse.json(
          { error: "Invalid contact number format" },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (contact_number !== undefined)
      updates.contact_number = contact_number.trim();
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const lifeguard = await LifeguardService.updateLifeguard(
      params.id,
      updates
    );

    return NextResponse.json(lifeguard);
  } catch (error) {
    console.error("Error updating lifeguard:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update lifeguard",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/lifeguards/[id] - Delete lifeguard
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await LifeguardService.deleteLifeguard(params.id);

    return NextResponse.json({ message: "Lifeguard deleted successfully" });
  } catch (error) {
    console.error("Error deleting lifeguard:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete lifeguard",
      },
      { status: 500 }
    );
  }
}
