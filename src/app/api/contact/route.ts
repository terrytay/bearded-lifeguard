import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate minimum message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Create transporter using existing SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const emailContent = `
New contact form submission from Bearded Lifeguard website:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

---
This message was sent from the contact form on your website.
Submitted at: ${new Date().toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
    })}
    `.trim();

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to the same email (admin)
      subject: `Contact Form: New inquiry from ${name}`,
      text: emailContent,
      replyTo: email, // Allow replying directly to the customer
    });

    // Send auto-reply to customer
    const autoReplyContent = `
Dear ${name},

Thank you for contacting Bearded Lifeguard! We have received your message and will get back to you within 24 hours.

Your inquiry:
"${message}"

If this is an urgent matter, please call us directly at +65 8200 6021.

Best regards,
Bearded Lifeguard Team

---
Bearded Lifeguard
Professional Lifeguard Services in Singapore
Email: sales@sglifeguardservices.com
Phone: +65 8200 6021
    `.trim();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "We received your message - Bearded Lifeguard",
      text: autoReplyContent,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
