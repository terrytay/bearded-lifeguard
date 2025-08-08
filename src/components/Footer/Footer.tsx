import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
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
