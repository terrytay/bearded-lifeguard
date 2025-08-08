"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "@/content/Content";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change or Esc
  useEffect(() => setIsOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      role="banner"
      className={`sticky top-0 inset-x-0 z-50 transition-colors duration-300
        ${
          scrolled || isOpen
            ? "bg-white/90 backdrop-blur-sm border-b border-gray-200/60"
            : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 relative">
        {/* Top bar */}
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Brand — bigger logo, no effects */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Bearded Lifeguard"
              width={72}
              height={72}
              className="h-16 w-16 md:h-20 md:w-20 object-contain"
              priority
            />
            <span className="hidden sm:block text-[#20334F] font-bold tracking-tight text-xl md:text-2xl">
              Bearded Lifeguard
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-6">
              {Menu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`relative px-1 py-2 text-sm font-medium transition-colors
                      ${
                        isActive(item.link)
                          ? "text-[#FF6633]"
                          : "text-[#20334F] hover:text-[#FF6633]"
                      }`}
                  >
                    {item.name}
                    <span
                      className={`pointer-events-none absolute left-0 right-0 -bottom-0.5 h-0.5 origin-left bg-[#FF6633] transition-transform duration-300
                        ${
                          isActive(item.link)
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-gray-200 bg-white"
          >
            <div className="relative h-4 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-[#20334F] transition-transform ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 bg-[#20334F] transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 bg-[#20334F] transition-transform ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu (no overlay, sits under header) */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full origin-top transition-[transform,opacity] duration-200
            ${
              isOpen
                ? "opacity-100 scale-y-100"
                : "pointer-events-none opacity-0 scale-y-95"
            }`}
        >
          <nav className="mt-2 rounded-xl bg-white ring-1 ring-gray-200 shadow-lg p-2">
            <ul className="flex flex-col">
              {Menu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors
                      ${
                        isActive(item.link)
                          ? "text-[#FF6633] bg-orange-50"
                          : "text-[#20334F] hover:bg-gray-50 hover:text-[#FF6633]"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
