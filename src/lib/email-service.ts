import nodemailer from "nodemailer";
import { CalendarHelper, type CalendarEvent } from "./calendar";

export type BookingEmailData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  startDateTime: string;
  endDateTime: string;
  hours: number;
  rate: string;
  subtotal: string;
  surcharge: string;
  totalAmount: string;
  leadTime: string;
  lastMinuteLabel: string;
  lifeguards: number;
  serviceType: string;
  customService: string;
  remarks: string;
  startISO?: string;
  endISO?: string;
};

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private formatServiceType(
    serviceType: string,
    customService: string
  ): string {
    const serviceNames: Record<string, string> = {
      pools: "Pool Lifeguarding",
      events: "Event Lifeguarding",
      "pool-parties": "Pool Party Lifeguarding",
      "open-water": "Open Water Lifeguarding",
      others: "Custom Service",
    };

    const baseName = serviceNames[serviceType] || serviceType;
    return serviceType === "others" && customService
      ? `${baseName}: ${customService}`
      : baseName;
  }

  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    const htmlContent = this.generateBookingEmailHTML(data);
    const textContent = this.generateBookingEmailText(data);

    // Generate calendar attachment if we have dates
    let attachments: any[] = [];
    if (data.startISO && data.endISO) {
      const calendarEvent: CalendarEvent = {
        title: `Bearded Lifeguard - ${this.formatServiceType(
          data.serviceType,
          data.customService
        )}`,
        startDate: new Date(data.startISO),
        endDate: new Date(data.endISO),
        description: `Professional lifeguard service booked through Bearded Lifeguard.\n\nOrder Reference: ${data.orderId}\nAmount Paid: ${data.totalAmount}\nLifeguards: ${data.lifeguards}\n\nOur certified lifeguard will arrive 15 minutes before the scheduled start time.\n\nFor any questions, contact us at support@sglifeguardservices.com or +65 9123 4567`,
        location: "To be confirmed by our operations team",
      };

      const icsContent = CalendarHelper.generateICSFile(calendarEvent);
      attachments.push({
        filename: `lifeguard-booking-${data.orderId}.ics`,
        content: icsContent,
        contentType: "text/calendar; charset=utf-8; method=REQUEST",
      });
    }

    const mailOptions = {
      from: {
        name: "Bearded Lifeguard",
        address:
          process.env.SMTP_FROM ||
          process.env.SMTP_USER ||
          "noreply@sglifeguardservices.com",
      },
      to: data.customerEmail,
      cc: "sales@sglifeguardservices.com",
      subject: `🏊‍♀️ Booking Confirmed - Order ${data.orderId} | Bearded Lifeguard`,
      html: htmlContent,
      text: textContent,
      attachments: attachments,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmationEmail(data: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    startDateTime: string;
    endDateTime: string;
    totalAmount: string;
  }): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmed - Bearded Lifeguard</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .status-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Payment Confirmed!</h1>
            <p>Your lifeguard service is now fully confirmed and ready to go.</p>
        </div>
        <div class="content">
            <p>Dear ${data.customerName},</p>
            
            <p>Great news! We've received and confirmed your payment for your lifeguard booking.</p>
            
            <div class="status-badge">
                🎉 PAYMENT CONFIRMED
            </div>
            
            <p><strong>Booking Details:</strong></p>
            <ul>
                <li><strong>Order Reference:</strong> ${data.orderId}</li>
                <li><strong>Service Date & Time:</strong> ${
                  data.startDateTime
                } - ${data.endDateTime}</li>
                <li><strong>Amount Paid:</strong> ${data.totalAmount}</li>
            </ul>
            
            <p><strong>What's Next?</strong></p>
            <p>Our operations team will contact you within 24 hours to confirm all final details for your lifeguard service. Our certified lifeguard will arrive 15 minutes before your scheduled start time.</p>
            
            <!-- Track Booking Section -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; color: white;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px;">📱 Track Your Booking</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9; font-size: 14px;">Keep track of your booking status and get updates in real-time.</p>
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://yourwebsite.com"
                }/track-booking?order=${data.orderId}" 
                   style="display: inline-block; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; border: 2px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px);">
                    🔍 Track Booking Status
                </a>
            </div>
            
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@sglifeguardservices.com">support@sglifeguardservices.com</a> or +65 9123 4567.</p>
            
            <p>Thank you for choosing Bearded Lifeguard!</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Bearded Lifeguard - Your Safety, Our Priority</p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
PAYMENT CONFIRMED - BEARDED LIFEGUARD

Dear ${data.customerName},

Great news! We've received and confirmed your payment for your lifeguard booking.

BOOKING DETAILS:
Order Reference: ${data.orderId}
Service Date & Time: ${data.startDateTime} - ${data.endDateTime}
Amount Paid: ${data.totalAmount}

WHAT'S NEXT:
Our operations team will contact you within 24 hours to confirm all final details for your lifeguard service. Our certified lifeguard will arrive 15 minutes before your scheduled start time.

TRACK YOUR BOOKING:
${
  process.env.NEXT_PUBLIC_BASE_URL || "https://yourwebsite.com"
}/track-booking?order=${data.orderId}

If you have any questions, contact us at support@sglifeguardservices.com or +65 9123 4567.

Thank you for choosing Bearded Lifeguard!

© ${new Date().getFullYear()} Bearded Lifeguard - Your Safety, Our Priority
`;

    const mailOptions = {
      from: {
        name: "Bearded Lifeguard",
        address:
          process.env.SMTP_FROM ||
          process.env.SMTP_USER ||
          "noreply@sglifeguardservices.com",
      },
      to: data.customerEmail,
      cc: "sales@sglifeguardservices.com",
      subject: `✅ Payment Confirmed - Order ${data.orderId} | Bearded Lifeguard`,
      html: htmlContent,
      text: textContent,
    };

    await this.transporter.sendMail(mailOptions);
  }

  private generateBookingEmailHTML(data: BookingEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no">
    <title>Booking Confirmation - Bearded lifeguard</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset & Base */
        * { box-sizing: border-box; }
        body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        /* Force light theme and prevent dark mode overrides */
        body, .email-container, .content, .booking-card, .card-body, .price-section, .contact-section {
            background-color: #ffffff !important;
            color: #1a1a1a !important;
            -webkit-text-fill-color: #1a1a1a !important;
        }
        
        /* Main Styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a !important;
            background: #f8fafc !important;
            min-height: 100vh;
            color-scheme: light only; /* Force light mode */
            supported-color-schemes: light only;
        }
        
        .email-container {
            max-width: 640px;
            width: 100%;
            margin: 20px auto;
            background: #ffffff !important;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.06);
        }
        
        /* Header with Hero */
        .header {
            background: linear-gradient(135deg, #FF6633 0%, #e55a2b 100%);
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.08)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.12)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            padding: 60px 40px;
            text-align: center;
            color: white;
        }
        
        .logo-section {
            margin-bottom: 30px;
        }
        
        .logo-icon {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .confirmation-title {
            font-size: 32px;
            font-weight: 800;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            letter-spacing: -0.5px;
        }
        
        .confirmation-subtitle {
            font-size: 16px;
            margin: 8px 0 0 0;
            opacity: 0.95;
            font-weight: 400;
        }
        
        /* Order Badge */
        .order-badge {
            display: inline-block;
            background: rgba(255,255,255,0.25);
            padding: 12px 24px;
            border-radius: 50px;
            margin-top: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .order-id {
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Content */
        .content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 18px;
            color: #1a1a1a;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        
        .greeting strong {
            color: #FF6633;
            font-weight: 600;
        }
        
        /* Booking Details Card */
        .booking-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            padding: 0;
            margin: 40px 0;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        
        .card-header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 25px 30px;
            border-bottom: none;
        }
        
        .card-title {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .card-body {
            padding: 30px;
        }
        
        /* Service Details */
        .service-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .detail-grid {
            display: grid;
            gap: 16px;
        }
        
        .detail-item {
            padding: 16px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .detail-label {
            font-weight: 500;
            color: #475569;
            font-size: 15px;
            padding: 0;
            margin: 0;
            width: 60%;
            vertical-align: top;
        }
        
        .detail-value {
            font-weight: 600;
            color: #1e293b;
            text-align: right;
            font-size: 15px;
            padding: 0;
            margin: 0;
            width: 40%;
            vertical-align: top;
        }
        
        .highlight-value {
            color: #FF6633;
            font-weight: 700;
        }
        
        /* Price Breakdown */
        .price-section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            border: 2px solid #f1f5f9;
        }
        
        .total-row {
            background: linear-gradient(135deg, #FF6633 0%, #e55a2b 100%);
            color: white;
            margin: 20px -25px -25px -25px;
            padding: 25px;
            border-radius: 0 0 10px 10px;
        }
        
        .total-amount {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        
        /* Next Steps */
        .next-steps {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #a7f3d0;
            border-radius: 16px;
            padding: 30px;
            margin: 40px 0;
            position: relative;
        }
        
        .next-steps::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, #10b981, #059669);
            border-radius: 2px;
        }
        
        .steps-title {
            margin: 0 0 20px 0;
            color: #065f46;
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .steps-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 16px;
            color: #047857;
            line-height: 1.6;
        }
        
        .step-number {
            background: #10b981;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        /* Contact Section */
        .contact-section {
            background: white;
            border: 2px solid #f1f5f9;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            margin: 40px 0;
        }
        
        .contact-title {
            margin: 0 0 20px 0;
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
        }
        
        .contact-methods {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #FF6633 0%, #e55a2b 100%);
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s ease;
        }
        
        .contact-item:hover {
            transform: translateY(-1px);
        }
        
        /* Footer */
        .footer {
            background: #1e293b;
            color: #94a3b8;
            padding: 40px;
            text-align: center;
        }
        
        .footer-content {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .company-name {
            color: white;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 14px;
            margin-bottom: 20px;
            opacity: 0.8;
        }
        
        .copyright {
            font-size: 12px;
            opacity: 0.6;
        }
        
        /* Enhanced Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .email-container { 
                margin: 10px !important; 
                border-radius: 16px;
                width: calc(100% - 20px) !important;
            }
            .header-content, .content, .contact-section, .footer { 
                padding: 25px 20px !important; 
            }
            .confirmation-title { 
                font-size: 24px !important; 
                line-height: 1.2 !important;
            }
            .card-body { 
                padding: 20px 15px !important; 
            }
            .contact-methods { 
                flex-direction: column !important; 
                align-items: center !important;
                gap: 15px !important;
            }
            .total-amount { 
                font-size: 22px !important; 
            }
            .detail-table {
                font-size: 14px !important;
            }
            .greeting {
                font-size: 16px !important;
            }
        }
        
        @media only screen and (max-width: 480px) {
            .email-container {
                margin: 5px !important;
                width: calc(100% - 10px) !important;
                border-radius: 12px;
            }
            .header-content {
                padding: 20px 15px !important;
            }
            .content {
                padding: 20px 15px !important;
            }
            .confirmation-title {
                font-size: 20px !important;
            }
        }
        
        /* Force light theme - disable dark mode completely */
        @media (prefers-color-scheme: dark) {
            body, .email-container, .content, .booking-card, .card-body, .price-section, .contact-section {
                background-color: #ffffff !important;
                color: #1a1a1a !important;
                -webkit-text-fill-color: #1a1a1a !important;
            }
            .greeting, .detail-label, .detail-value, .contact-title {
                color: #1a1a1a !important;
                -webkit-text-fill-color: #1a1a1a !important;
            }
            .booking-card {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                border-color: #e2e8f0 !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <div class="logo-icon">🏊‍♀️</div>
                </div>
                <h1 class="confirmation-title">Booking Confirmed!</h1>
                <p class="confirmation-subtitle">Your professional lifeguard service is secured</p>
                <div class="order-badge">
                    <div class="order-id">Order #${data.orderId}</div>
                </div>
            </div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Dear <strong>${data.customerName}</strong>,
                <br><br>
                Thank you for choosing Bearded Lifeguard! We're excited to provide you with professional lifeguard services. Your booking has been confirmed and we will contact you once we have verified your payment.
            </div>
            
            <!-- Booking Details -->
            <div class="booking-card">
                <div class="card-header">
                    <h2 class="card-title">
                        📅 Service Details
                    </h2>
                </div>
                <div class="card-body">
                    <!-- Service Period -->
                    <div class="service-section">
                        <div class="section-title">
                            ⏰ Service Period
                        </div>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Start Time</td>
                                        <td class="detail-value highlight-value">${
                                          data.startDateTime
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">End Time</td>
                                        <td class="detail-value highlight-value">${
                                          data.endDateTime
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Total Duration</td>
                                        <td class="detail-value">${
                                          data.hours
                                        } hour${data.hours > 1 ? "s" : ""}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Lifeguards Required</td>
                                        <td class="detail-value highlight-value">${
                                          data.lifeguards
                                        } professional lifeguard${
      data.lifeguards > 1 ? "s" : ""
    }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Service Type</td>
                                        <td class="detail-value">${this.formatServiceType(
                                          data.serviceType,
                                          data.customService
                                        )}</td>
                                    </tr>
                                </table>
                            </div>
                            ${
                              data.remarks.trim()
                                ? `<div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Additional Remarks</td>
                                        <td class="detail-value">${data.remarks
                                          .trim()
                                          .replace(/\n/g, "<br>")}</td>
                                    </tr>
                                </table>
                            </div>`
                                : ""
                            }
                        </div>
                    </div>
                    
                    <!-- Pricing -->
                    <div class="price-section">
                        <div class="section-title">
                            💰 Pricing Breakdown
                        </div>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Hourly Rate</td>
                                        <td class="detail-value">${
                                          data.rate
                                        }/hr</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Service Subtotal</td>
                                        <td class="detail-value">${
                                          data.subtotal
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Booking Lead Time</td>
                                        <td class="detail-value">${
                                          data.leadTime
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Rate Category</td>
                                        <td class="detail-value">${
                                          data.lastMinuteLabel
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="detail-item">
                                <table class="detail-table">
                                    <tr>
                                        <td class="detail-label">Additional Charges</td>
                                        <td class="detail-value">${
                                          data.surcharge
                                        }</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                        <div class="total-row">
                            <table class="detail-table">
                                <tr>
                                    <td class="detail-label" style="color: white !important; font-size: 18px !important;">Total Amount Paid</td>
                                    <td class="total-amount" style="color: white !important;">${
                                      data.totalAmount
                                    }</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3 class="steps-title">
                    ✅ What Happens Next
                </h3>
                <ul class="steps-list">
                    <li class="step-item">
                        <div class="step-number">1</div>
                        <div>Our team will contact you within <strong>24 hours</strong> to confirm deployment details and discuss any special requirements</div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">2</div>
                        <div>We'll coordinate logistics including access, emergency procedures, and equipment placement for your venue</div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">3</div>
                        <div>Our <strong>certified lifeguard</strong> will arrive 15 minutes early to set up and conduct safety checks</div>
                    </li>
                    <li class="step-item">
                        <div class="step-number">4</div>
                        <div>You'll receive a confirmation call <strong>24 hours before</strong> your service for final details</div>
                    </li>
                </ul>
            </div>
            
            ${
              data.startISO && data.endISO
                ? `<!-- Calendar Section -->
            <div class="contact-section" style="margin-bottom: 40px;">
                <h3 class="contact-title">📅 Add to Calendar</h3>
                <p style="text-align: center; color: #64748b; margin-bottom: 20px; font-size: 14px;">
                    Don't forget about your lifeguard service! Add this booking to your calendar.
                </p>
                <div class="contact-methods">
                    <a href="${CalendarHelper.generateGoogleCalendarUrl({
                      title: `Bearded Lifeguard - ${this.formatServiceType(
                        data.serviceType,
                        data.customService
                      )}`,
                      startDate: new Date(data.startISO),
                      endDate: new Date(data.endISO),
                      description: `Professional lifeguard service. Order: ${data.orderId}. Amount: ${data.totalAmount}`,
                      location: "To be confirmed by our operations team",
                    })}" class="contact-item" style="background: linear-gradient(135deg, #4285f4 0%, #356ac3 100%);">
                        📅 Google Calendar
                    </a>
                    <a href="${CalendarHelper.generateOutlookCalendarUrl({
                      title: `Bearded Lifeguard - ${this.formatServiceType(
                        data.serviceType,
                        data.customService
                      )}`,
                      startDate: new Date(data.startISO),
                      endDate: new Date(data.endISO),
                      description: `Professional lifeguard service. Order: ${data.orderId}. Amount: ${data.totalAmount}`,
                      location: "To be confirmed by our operations team",
                    })}" class="contact-item" style="background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);">
                        📅 Outlook Calendar
                    </a>
                </div>
                <p style="text-align: center; color: #64748b; margin-top: 15px; font-size: 12px;">
                    A calendar file (.ics) has also been attached to this email for easy import.
                </p>
            </div>`
                : ""
            }
            
            <!-- Track Booking Section -->
            <div class="contact-section" style="margin-bottom: 30px;">
                <h3 class="contact-title">📱 Track Your Booking</h3>
                <p style="text-align: center; color: #64748b; margin-bottom: 20px; font-size: 14px;">
                    Keep track of your booking status and get updates in real-time.
                </p>
                <div class="contact-methods" style="justify-content: center;">
                    <a href="${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://yourwebsite.com"
                    }/track-booking?order=${
      data.orderId
    }" class="contact-item" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); max-width: 300px;">
                        🔍 Track Booking Status
                    </a>
                </div>
            </div>
            
            <!-- Contact Section -->
            <div class="contact-section">
                <h3 class="contact-title">Need Assistance?</h3>
                <div class="contact-methods">
                    <a href="mailto:sales@sglifeguardservices.com" class="contact-item">
                        ✉️ Email Support
                    </a>
                    <a href="tel:+6582006021" class="contact-item">
                        📞 Call Us
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="company-name">Bearded Lifeguard</div>
                <div class="tagline">Your Safety, Our Priority</div>
                <div class="copyright">
                    © ${new Date().getFullYear()} Bearded Lifeguard. All rights reserved.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private generateBookingEmailText(data: BookingEmailData): string {
    return `
BOOKING CONFIRMATION - BEARDED LIFEGUARD

Dear ${data.customerName},

Thank you for choosing Bearded Lifeguard! Your booking has been confirmed and payment received.

BOOKING DETAILS:
Order ID: ${data.orderId}
Service Start: ${data.startDateTime}
Service End: ${data.endDateTime}
Duration: ${data.hours} hour${data.hours > 1 ? "s" : ""}
Lifeguards Required: ${data.lifeguards} professional lifeguard${
      data.lifeguards > 1 ? "s" : ""
    }
Service Type: ${this.formatServiceType(data.serviceType, data.customService)}${
      data.remarks.trim() ? `\nAdditional Remarks: ${data.remarks.trim()}` : ""
    }
Rate Applied: ${data.rate}/hr
Subtotal: ${data.subtotal}
Booking Notice: ${data.leadTime}
Pricing Tier: ${data.lastMinuteLabel}
Additional Charges: ${data.surcharge}
Total Amount Paid: ${data.totalAmount}

WHAT HAPPENS NEXT:
1. Our team will contact you within 24 hours to confirm lifeguard deployment details
2. We'll coordinate the exact logistics and any special requirements for your venue
3. Our certified lifeguard will arrive 15 minutes before your scheduled start time
4. You'll receive a follow-up call 24 hours before your booking for final confirmation

TRACK YOUR BOOKING:
${
  process.env.NEXT_PUBLIC_BASE_URL || "https://yourwebsite.com"
}/track-booking?order=${data.orderId}

NEED ASSISTANCE?
Email: sales@sglifeguardservices.com
Phone: +65 8200 6021

© ${new Date().getFullYear()} Bearded Lifeguard - Your Safety, Our Priority
`;
  }
}
