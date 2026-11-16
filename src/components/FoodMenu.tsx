"use client";

import { motion } from "framer-motion";
import { cardMotion, listMotion } from "./menuMotion";
import { currency, type MenuCategory } from "@/data/menu";

/**
 * The Food and Salades tabs of the menu, set like a printed menu: name and
 * price on one line, what is in it underneath. From src/data/menu.ts.
 */
export function FoodMenu({ category }: { category: MenuCategory }) {
  return (
    <motion.ul
      className="grid gap-x-14 border-t-2 border-ink md:grid-cols-2"
      variants={listMotion}
      initial="hidden"
      animate="shown"
    >
      {category.items.map((item) => (
        <motion.li
          key={item.name}
          variants={cardMotion}
          className="group border-b border-ink/12 py-6 transition-colors duration-300 hover:border-ink/45"
        >
          {item.image && (
            <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-milk">
              <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex items-baseline gap-3">
            <h4 className="font-display text-[1.45rem] lowercase leading-tight md:text-[1.55rem]">{item.name}</h4>
            {item.label && (
              <span className="translate-y-[-3px] rounded-full bg-sign px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.14em] text-ink">
                {item.label}
              </span>
            )}
            <span aria-hidden className="mx-1 h-px min-w-4 flex-1 translate-y-[-5px] border-b border-dotted border-ink/30" />
            <span className="shrink-0 font-display text-[1.45rem] tabular-nums md:text-[1.55rem]">
              {item.price}
              {currency}
            </span>
          </div>
          {item.description && (
            <p className="mt-2 max-w-[30rem] text-[0.95rem] leading-relaxed text-ink/65">{item.description}</p>
          )}
          {item.tag && <p className="mt-3 text-[0.8rem] uppercase tracking-[0.14em] text-ink/45">{item.tag}</p>}
        </motion.li>
      ))}
    </motion.ul>
  );
}
