"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  delay?: number;
  y?: number;
}>;

export function Reveal({ children, delay = 0, y = 16 }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
