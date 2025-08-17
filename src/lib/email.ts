import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT = "587",
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL = "no-reply@yourdomain.com",
  INTERNAL_EMAIL = "sales@sglifeguardservices.com",
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth:
    SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export type OrderEmail = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail(msg: OrderEmail) {
  const res = await transporter.sendMail({
    from: FROM_EMAIL,
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
  });
  return res;
}

export function renderOrderEmail({
  name,
  email,
  orderId,
  dateISO,
  hours,
  location,
  total,
  reference,
}: any) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <h2>Booking Confirmation</h2>
    <p>Hi ${name || "there"}, thanks for booking a lifeguard.</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <ul>
      <li><strong>Date:</strong> ${new Date(dateISO).toLocaleString()}</li>
      <li><strong>Hours:</strong> ${hours} h</li>
      <li><strong>Location:</strong> ${location || "-"}</li>
      <li><strong>Total:</strong> $${total.toFixed(2)}</li>
      <li><strong>Payment Reference:</strong> ${reference}</li>
    </ul>
    <p>Please scan the PayNow QR on the site to pay. Keep your reference <strong>${reference}</strong> intact.</p>
  </div>`;
}
