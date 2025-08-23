import { NextResponse } from "next/server";
import { BookingService } from "../../../../lib/booking-service";

// GET /api/booking-status/[orderId] - Get booking status for customer
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  try {
    const booking = await BookingService.getBookingByOrderId(orderId);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' }, 
        { status: 404 }
      );
    }

    // Return only necessary information for customer
    const customerBookingInfo = {
      orderId: booking.order_id,
      status: booking.status,
      paymentStatus: booking.payment_status,
      startDateTime: booking.start_datetime,
      endDateTime: booking.end_datetime,
      serviceType: booking.service_type,
      lifeguards: booking.lifeguards,
      amount: booking.amount,
      createdAt: booking.created_at
    };

    return NextResponse.json({ booking: customerBookingInfo });
  } catch (error) {
    console.error('Error fetching booking status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking status' },
      { status: 500 }
    );
  }
}