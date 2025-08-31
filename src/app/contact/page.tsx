"use client";

import { useState, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const nameOk = useMemo(() => name.trim().length >= 2, [name]);
  const emailOk = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
  const phoneSanitized = useMemo(() => phone.replace(/\s|-/g, ""), [phone]);
  const phoneOk = useMemo(() => {
    if (/^\+65\d{8}$/.test(phoneSanitized)) return true; // typical SG
    return /^\+?\d{8,15}$/.test(phoneSanitized);
  }, [phoneSanitized]);
  const messageOk = useMemo(() => message.trim().length >= 10, [message]);

  const formOk = nameOk && emailOk && phoneOk && messageOk && !submitting;

  function markTouched(k: string) {
    setTouched((t) => ({ ...t, [k]: true }));
  }

  async function handleSubmit() {
    if (!formOk) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        message: true,
      });
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phoneSanitized,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#20334F] mb-3">
            Message Sent Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setPhone("");
              setMessage("");
              setTouched({});
            }}
            className="w-full bg-gradient-to-r from-[#FF6633] to-[#ff8566] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#20334F] mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help! Send us a
            message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[#20334F] mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#FF6633]" />
              Send Us a Message
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Name */}
              <FormField
                label="Full Name"
                required
                error={
                  touched.name && !nameOk
                    ? "Please enter your full name (minimum 2 characters)"
                    : undefined
                }
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder="Enter your full name"
                  error={touched.name && !nameOk}
                  icon={<User size={16} />}
                  autoComplete="name"
                />
              </FormField>

              {/* Email */}
              <FormField
                label="Email Address"
                required
                description="We'll use this to respond to your inquiry"
                error={
                  touched.email && !emailOk
                    ? "Please enter a valid email address"
                    : undefined
                }
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  placeholder="your@email.com"
                  error={touched.email && !emailOk}
                  icon={<Mail size={16} />}
                  autoComplete="email"
                />
              </FormField>

              {/* Phone */}
              <FormField
                label="Contact Number"
                required
                error={
                  touched.phone && !phoneOk
                    ? "Please enter a valid phone number"
                    : undefined
                }
              >
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  placeholder="+65 9XXX XXXX"
                  error={touched.phone && !phoneOk}
                  icon={<Phone size={16} />}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </FormField>

              {/* Message */}
              <FormField
                label="Message"
                required
                description="Please provide details about your inquiry"
                error={
                  touched.message && !messageOk
                    ? "Please enter your message (minimum 10 characters)"
                    : undefined
                }
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => markTouched("message")}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 bg-white placeholder:text-gray-400 resize-y ${
                    touched.message && !messageOk
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-[#FF6633] hover:border-gray-300"
                  }`}
                />
              </FormField>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">
                      Error sending message
                    </p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formOk}
                className={`w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                  formOk
                    ? "bg-gradient-to-r from-[#FF6633] to-[#ff8566] text-white hover:shadow-xl hover:scale-105 active:scale-95"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[#20334F] mb-6">
                Get In Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF6633]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#FF6633]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#20334F]">Email</p>
                    <p className="text-gray-600">
                      sales@sglifeguardservices.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF6633]/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#FF6633]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#20334F]">
                      Phone / WhatsApp
                    </p>
                    <p className="text-gray-600">+65 8200 6021</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FF6633]/10 to-[#ff8566]/10 rounded-2xl p-8 border border-[#FF6633]/20">
              <h3 className="text-xl font-bold text-[#20334F] mb-4">
                Quick Response
              </h3>
              <p className="text-gray-700 mb-4">
                We typically respond to all inquiries within 24 hours during
                business days. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
