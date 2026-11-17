"use client";

import { motion } from "framer-motion";
import { cardMotion, listMotion } from "./menuMotion";
import { currency, type MenuCategory } from "@/data/menu";

/**
 * The Food and Salades tabs of the menu, set like a printed menu: name and
 * price on one line, what is in it underneath. Hovering a dish runs the
 * sign's yellow across the line. From src/data/menu.ts.
 */
export function FoodMenu({ category }: { category: MenuCategory }) {
  return (
    <motion.ul
      className="border-t border-milk/15"
      variants={listMotion}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.05 }}
    >
      {category.items.map((item, index) => (
        <motion.li
          key={item.name}
          variants={cardMotion}
          className="group relative isolate overflow-hidden border-b border-milk/12"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-[2px] bg-sign transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100"
          />
          <div className="flex gap-4 px-1 py-6 transition-colors duration-300 group-hover:text-ink md:gap-7 md:px-5 md:py-7">
            <span className="w-7 shrink-0 pt-2 font-display text-sm tabular-nums text-milk/35 transition-colors duration-300 group-hover:text-ink/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              {item.image && (
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[12px] bg-milk/5">
                  <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <h4 className="font-display text-[1.55rem] lowercase leading-tight transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1.5 md:text-[1.95rem]">
                  {item.name}
                </h4>
                {item.label && (
                  <span className="translate-y-[-4px] rounded-full bg-sign px-2.5 py-0.5 text-[0.66rem] uppercase tracking-[0.14em] text-ink ring-1 ring-ink/20">
                    {item.label}
                  </span>
                )}
                <span
                  aria-hidden
                  className="mx-1 h-px min-w-4 flex-1 translate-y-[-6px] border-b border-dotted border-milk/25 transition-colors duration-300 group-hover:border-ink/40"
                />
                <span className="shrink-0 font-display text-[1.55rem] tabular-nums text-sign transition-colors duration-300 group-hover:text-ink md:text-[1.95rem]">
                  {item.price}
                  {currency}
                </span>
              </div>
              {item.description && (
                <p className="mt-2 max-w-[36rem] text-[0.98rem] leading-relaxed text-milk/60 transition-colors duration-300 group-hover:text-ink/75">
                  {item.description}
                </p>
              )}
              {item.tag && (
                <p className="mt-3 text-[0.75rem] uppercase tracking-[0.16em] text-milk/40 transition-colors duration-300 group-hover:text-ink/55">
                  {item.tag}
                </p>
              )}
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
