import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Bearded Lifeguard"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <div className="text-[#20334F] font-semibold leading-tight">
              <div className="text-base">Bearded Lifeguard</div>
              <div className="text-xs text-gray-500">
                Your Safety, Our Priority
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="mailto:sales@sglifeguardservices.com"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 px-3 py-2 text-sm text-[#20334F] hover:text-[#FF6633] hover:ring-[#FF6633] transition"
              aria-label="Email sales@sglifeguardservices.com"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">
                sales@sglifeguardservices.com
              </span>
            </Link>
            <Link
              href="https://wa.me/6582006021"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 px-3 py-2 text-sm text-[#20334F] hover:text-[#FF6633] hover:ring-[#FF6633] transition"
              aria-label="WhatsApp +6582006021"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#000000"
                className="h-4 w-4"
              >
                <path
                  fill="#000000"
                  d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4"
                />
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
            <Link
              href="https://www.instagram.com/bearded_lifeguard/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 px-3 py-2 text-sm text-[#20334F] hover:text-[#FF6633] hover:ring-[#FF6633] transition"
              aria-label="Instagram @bearded_lifeguard"
            >
              <Instagram className="h-4 w-4" />
              <span className="hidden sm:inline">@bearded_lifeguard</span>
            </Link>
          </div>
        </div>

        {/* divider */}
        <div className="my-8 h-px bg-gray-100" />

        {/* bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} Bearded Lifeguard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
