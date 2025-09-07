"use client";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  // optional extra classes for the dialog container
  dialogClassName?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  dialogClassName = "",
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // lock body scroll while open
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    const prev = body.style.overflow;
    if (open) body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [open, mounted]);

  // close on Escape
  useEffect(() => {
    if (!mounted || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    open ? (
      <div
        // full-viewport backdrop + centered flex container
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        {/* Inner wrapper: keeps dialog centered but allows internal scrolling for tall content */}
        <div className="w-full max-w-md max-h-[calc(100vh-4rem)] overflow-auto">
          <div
            className={`bg-white rounded-3xl shadow-2xl p-6 ${dialogClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    ) : null,
    document.body
  );
}
