"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronUp } from "lucide-react"; // npm install lucide-react

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 10) {
        setVisible(true);
        setShow(true);

        // clear old timer
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          setShow(false);
        }, 2000);
      } else {
        setVisible(false);
        setShow(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        visible && show
          ? "opacity-100 translate-y-0 bg-blue-600 hover:bg-blue-700 text-white"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ChevronUp size={20} />
    </button>
  );
}
