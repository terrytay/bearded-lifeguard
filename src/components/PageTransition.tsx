"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  // Simple fade/slide; tweak once and every page inherits it
  const variants = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 8, filter: "blur(2px)" },
    enter: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: prefersReduced ? 0 : -8, filter: "blur(2px)" },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-h-dvh"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
