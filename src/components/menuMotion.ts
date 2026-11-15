import type { Variants } from "framer-motion";

/** Cards arrive one after another when a menu tab opens. */
export const listMotion: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

export const cardMotion: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};
