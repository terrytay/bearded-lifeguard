"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Status = "idle" | "sending" | "ok" | "error";

export default function FloatingEnquiry() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // form state
  const [topic, setTopic] = useState<
    "general" | "courses" | "water-safety" | "services"
  >("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    }
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, phone, message, company }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to send");
      setStatus("ok");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCompany("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong");
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open enquiry form"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6633] text-white shadow-lg ring-1 ring-orange-200 hover:opacity-90 cursor-pointer"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div
        className={`fixed inset-x-4 sm:inset-auto sm:right-6 sm:bottom-6 z-50
          ${
            open
              ? "pointer-events-auto opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 translate-y-2"
          }
          transition-all duration-200`}
        aria-live="polite"
      >
        <div
          role="dialog"
          aria-modal="true"
          className="mx-auto max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-lg font-semibold text-[#20334F]">
              Have a question? Feel free to ask us!
            </h2>
            <button
              aria-label="Close enquiry form"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-gray-50"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-5 space-y-4">
            {/* honeypot */}
            <input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#20334F]">
                  Name
                </label>
                <input
                  ref={firstFieldRef}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#20334F]">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
                >
                  <option value="general">General</option>
                  <option value="services">Lifeguard Services</option>
                  <option value="courses">Lifesaving Courses</option>
                  <option value="water-safety">Water Safety</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#20334F]">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#20334F]">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#20334F]">
                Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6633]"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center rounded-lg bg-[#FF6633] px-4 py-2.5 text-white shadow hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send enquiry"}
              </button>
              {status === "ok" && (
                <span className="text-sm text-green-700">
                  Thanks! We’ll reply shortly.
                </span>
              )}
              {status === "error" && (
                <span className="text-sm text-red-600">{error}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
