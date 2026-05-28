// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { PaynowQR } from "../../../lib/paynow";
import { EmailService } from "../../../lib/email-service";
import { BookingService } from "../../../lib/booking-service";
import { SingaporeTime } from "../../../lib/singapore-time";
import {
  computeBaseSubtotal,
  lastMinuteMultiplier,
  resolveRateCategory,
  type RateCategory,
} from "../../../lib/pricing";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    email,
    phone,
    dateISO, // booking date/time string (optional)
    hours, // integer hours
    noticeDays = 14, // int days notice till event
    lifeguards = 1, // number of lifeguards required
    serviceType = "", // service type selection
    customService = "", // custom service description
    venueType, // "swimming-pool" | "open-water" — required when serviceType is events/others
    location = "", // event location
    remarks = "", // optional remarks from user
    startISO,
    endISO
  } = body;

  const category = resolveRateCategory(serviceType, venueType as RateCategory | undefined);
  if (!category) {
    return NextResponse.json(
      { error: "Missing or invalid venueType for the selected serviceType" },
      { status: 400 }
    );
  }

  const base = computeBaseSubtotal(Number(hours), category);
  const subtotal = base * lastMinuteMultiplier(Number(noticeDays));
  const total = subtotal * Number(lifeguards);

  const orderId = `BL-${Date.now().toString().slice(-6)}-${randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;

  // expiry (optional): 2 hours from now in Singapore time, format YYMMDDhhmm
  const now = SingaporeTime.now();
  const exp = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const expiry = `${String(exp.getFullYear()).slice(2)}${pad(
    exp.getMonth() + 1
  )}${pad(exp.getDate())}${pad(exp.getHours())}${pad(exp.getMinutes())}`;

  const PAYNOW_UEN = process.env.PAYNOW_UEN || "201706196C"; // <-- put your real UEN in .env

  const payload = new PaynowQR({
    uen: PAYNOW_UEN,
    amount: total.toFixed(2), // fixed amount
    editable: false, // lock the amount
    expiry, // optional
    refNumber: orderId, // your reconciliation ID
    company: "BEARDED LIFEGUARD", // label
  }).output();

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
  });

  try {
    // Save booking to Supabase
    await BookingService.createBooking({
      order_id: orderId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      start_datetime: startISO || dateISO, // Singapore datetime string from frontend
      end_datetime: endISO || dateISO, // Singapore datetime string from frontend
      hours: Number(hours),
      lifeguards: Number(lifeguards),
      service_type: serviceType,
      custom_service: customService || null,
      venue_type: category,
      location: location || null,
      remarks: remarks || null,
      amount: total,
      status: 'pending',
      payment_status: 'pending',
      viewed_by_admin: false
    });
  } catch (error) {
    console.error('Failed to save booking to Supabase:', error);
    // Continue with the response even if Supabase fails
  }

  return NextResponse.json({
    orderId,
    amount: total,
    name,
    email,
    phone,
    dateISO,
    hours,
    lifeguards,
    serviceType,
    customService,
    venueType: category,
    remarks,
    paynow: { payload, qrDataUrl },
  });
}
