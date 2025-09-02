import { NextResponse } from "next/server";
import { BookingService } from "../../../../../lib/booking-service";
import { EmailService } from "../../../../../lib/email-service";
import { createClient } from "../../../../../lib/supabase/server";
import { SingaporeTime } from "../../../../../lib/singapore-time";

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

// GET /api/admin/bookings/[id] - Get specific booking
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

    const booking = await BookingService.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/bookings/[id] - Update booking
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updates } = body;

    let booking;

    if (action === "mark_viewed") {
      booking = await BookingService.markAsViewed(id);
    } else if (action === "mark_unviewed") {
      booking = await BookingService.markAsUnviewed(id);
    } else if (action === "update_payment_status") {
      const { payment_status, status } = updates;
      booking = await BookingService.updatePaymentStatus(
        id,
        payment_status,
        status
      );

      // If status changed to paid, send notification email
      if (payment_status === "paid" && updates.send_email) {
        try {
          const emailService = new EmailService();
          await emailService.sendPaymentConfirmationEmail({
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            orderId: booking.order_id,
            startDateTime: SingaporeTime.toLocaleString(booking.start_datetime),
            endDateTime: SingaporeTime.toLocaleString(booking.end_datetime),
            totalAmount: `$${booking.amount.toFixed(2)}`,
          });
        } catch (emailError) {
          console.error(
            "Failed to send payment confirmation email:",
            emailError
          );
          // Don't fail the request if email fails
        }
      }
    } else {
      booking = await BookingService.updateBooking(id, updates);
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/[id] - Delete booking
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await BookingService.deleteBooking(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
