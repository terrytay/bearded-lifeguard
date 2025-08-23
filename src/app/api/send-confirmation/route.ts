import { NextResponse } from "next/server";
import { EmailService, type BookingEmailData } from "../../../lib/email-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderId,
      startDateTime,
      endDateTime,
      hours,
      rate,
      subtotal,
      surcharge,
      totalAmount,
      leadTime,
      lastMinuteLabel,
      lifeguards,
      serviceType,
      customService,
      remarks,
    } = body;

    if (!customerName || !customerEmail || !orderId || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData: BookingEmailData = {
      customerName,
      customerEmail,
      customerPhone: customerPhone || "Not provided",
      orderId,
      startDateTime,
      endDateTime,
      hours: hours || 1,
      rate: rate || "$50.00",
      subtotal: subtotal || "$0.00",
      surcharge: surcharge || "$0.00",
      totalAmount: totalAmount || "$0.00",
      leadTime: leadTime || "Not specified",
      lastMinuteLabel: lastMinuteLabel || "Standard rate",
      lifeguards: lifeguards || 1,
      serviceType: serviceType || "",
      customService: customService || "",
      remarks: remarks || "",
    };

    // Send confirmation email
    const emailService = new EmailService();
    await emailService.sendBookingConfirmation(emailData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}