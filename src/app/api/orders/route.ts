// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { PaynowQR } from "../../../lib/paynow";

function computeAmount(hours: number) {
  if (hours < 4) return hours * 50;
  if (hours === 4) return 4 * 30;
  if (hours === 5) return 5 * 25;
  return hours * 21; // >= 6
}
function lastMinuteMultiplier(noticeDays: number) {
  if (noticeDays < 1) return 2.0; // <1 day = +100%
  if (noticeDays < 2) return 1.4; // <2 days = +40%
  if (noticeDays < 7) return 1.2; // <1 week = +20%
  return 1.0;
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    email,
    phone,
    dateISO, // booking date/time string (optional)
    hours, // integer hours
    noticeDays = 14, // int days notice till event
  } = body;

  const base = computeAmount(Number(hours));
  const total = base * lastMinuteMultiplier(Number(noticeDays));

  const orderId = `BL-${Date.now().toString().slice(-6)}-${randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;

  // expiry (optional): 2 hours from now, format YYMMDDhhmm
  const now = new Date();
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

  return NextResponse.json({
    orderId,
    amount: total,
    name,
    email,
    phone,
    dateISO,
    hours,
    paynow: { payload, qrDataUrl },
  });
}
