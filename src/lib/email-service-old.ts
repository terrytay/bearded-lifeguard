import nodemailer from "nodemailer";

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

  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    const htmlContent = this.generateBookingEmailHTML(data);
    const textContent = this.generateBookingEmailText(data);

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
      subject: `Booking Confirmation - Order ${data.orderId}`,
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
    <title>Booking Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #FF6633, #e55a2b); color: white; padding: 2rem; text-align: center; }
        .header h1 { margin: 0; font-size: 1.8rem; font-weight: bold; }
        .header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
        .content { padding: 2rem; }
        .booking-details { background-color: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #e9ecef; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #20334F; }
        .detail-value { color: #384152; text-align: right; }
        .total-row { background-color: #20334F; color: white; margin: 1rem -1.5rem -1.5rem -1.5rem; padding: 1rem 1.5rem; border-radius: 0 0 8px 8px; }
        .total-row .detail-row { border-bottom: none; padding: 0.5rem 0; }
        .total-row .detail-label, .total-row .detail-value { color: white; font-size: 1.1rem; font-weight: bold; }
        .next-steps { background-color: #e8f4fd; border-left: 4px solid #FF6633; padding: 1.5rem; margin: 2rem 0; }
        .next-steps h3 { margin: 0 0 1rem 0; color: #20334F; }
        .next-steps ul { margin: 0.5rem 0 0 1rem; padding: 0; }
        .next-steps li { margin-bottom: 0.5rem; }
        .contact-info { background-color: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; margin-top: 2rem; }
        .contact-info h3 { margin: 0 0 1rem 0; color: #20334F; }
        .contact-link { color: #FF6633; text-decoration: none; font-weight: 600; }
        .footer { background-color: #20334F; color: white; padding: 1.5rem; text-align: center; }
        .footer p { margin: 0; opacity: 0.8; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏊‍♀️ Booking Confirmed!</h1>
            <p>Your lifeguard service has been successfully booked</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${data.customerName}</strong>,</p>
            
            <p>Thank you for choosing Bearded Lifeguard! Your booking has been confirmed and payment received. Here are your booking details:</p>
            
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Order ID</span>
                    <span class="detail-value"><strong>${
                      data.orderId
                    }</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service Start</span>
                    <span class="detail-value">${data.startDateTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service End</span>
                    <span class="detail-value">${data.endDateTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${data.hours} hour${
      data.hours > 1 ? "s" : ""
    }</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Rate Applied</span>
                    <span class="detail-value">${data.rate}/hr</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Subtotal</span>
                    <span class="detail-value">${data.subtotal}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Notice</span>
                    <span class="detail-value">${data.leadTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Pricing Tier</span>
                    <span class="detail-value">${data.lastMinuteLabel}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Additional Charges</span>
                    <span class="detail-value">${data.surcharge}</span>
                </div>
                
                <div class="total-row">
                    <div class="detail-row">
                        <span class="detail-label">Total Amount Paid</span>
                        <span class="detail-value">${data.totalAmount}</span>
                    </div>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                    <li>Our team will contact you within 24 hours to confirm lifeguard deployment details</li>
                    <li>We'll coordinate the exact logistics and any special requirements for your venue</li>
                    <li>Our certified lifeguard will arrive 15 minutes before your scheduled start time</li>
                    <li>You'll receive a follow-up call 24 hours before your booking for final confirmation</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <h3>Need assistance?</h3>
                <p>Contact us at <a href="mailto:sales@sglifeguardservices.com" class="contact-link">sales@sglifeguardservices.com</a></p>
                <p>Phone: <a href="tel:+6591234567" class="contact-link">+65 9123 4567</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Bearded Lifeguard - Your Safety, Our Priority</p>
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
Rate Applied: ${data.rate}/hr
Subtotal: ${data.subtotal}
Booking Notice: ${data.leadTime}
Pricing Tier: ${data.lastMinuteLabel}
Additional Charges: ${data.surcharge}
Total Amount Paid: ${data.totalAmount}

WHAT HAPPENS NEXT:
• Our team will contact you within 24 hours to confirm lifeguard deployment details
• We'll coordinate the exact logistics and any special requirements for your venue
• Our certified lifeguard will arrive 15 minutes before your scheduled start time
• You'll receive a follow-up call 24 hours before your booking for final confirmation

NEED ASSISTANCE?
Email: sales@sglifeguardservices.com
Phone: +65 9123 4567

© ${new Date().getFullYear()} Bearded Lifeguard - Your Safety, Our Priority
`;
  }
}
