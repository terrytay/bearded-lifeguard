import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // nodemailer needs Node runtime

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // very light validation
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const topic = String(data.topic || "general").trim();
    const message = String(data.message || "").trim();
    const honey = String(data.company || "").trim(); // honeypot, must be blank

    if (!name || !email || honey) {
      return NextResponse.json(
        { ok: false, error: "Invalid form" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.CONTACT_TO || "sales@sglifeguardservices.com";
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || to;

    const subjectMap: Record<string, string> = {
      courses: "Enquiry: Lifesaving Courses",
      "water-safety": "Enquiry: Water Safety",
      general: "Enquiry",
    };

    const subject = subjectMap[topic] || subjectMap.general;

    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p><strong>Topic:</strong> ${escapeHtml(subject)}</p>
      <hr/>
      <p style="white-space:pre-wrap">${escapeHtml(
        message || "(no message)"
      )}</p>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      replyTo: email,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
