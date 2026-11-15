"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

const variants: Record<"rise" | "unmask", Variants> = {
  // Text and blocks: a short, soft lift.
  rise: {
    hidden: { opacity: 0, y: 22 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  },
  // Photos: uncovered from the top, like a blind going up.
  unmask: {
    hidden: { clipPath: "inset(0% 0% 100% 0%)" },
    shown: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease } },
  },
};

/** Plays once, when the element scrolls into view. */
export function Reveal({
  children,
  className,
  kind = "rise",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  kind?: "rise" | "unmask";
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={variants[kind]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Honours the visitor's reduced-motion setting for every animation in the page body. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
