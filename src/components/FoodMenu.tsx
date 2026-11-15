"use client";

import { motion } from "framer-motion";
import { cardMotion, listMotion } from "./menuMotion";
import { currency, type MenuCategory } from "@/data/menu";

/** The Food and Salades tabs of the menu: one card per dish, from src/data/menu.ts. */
export function FoodMenu({ category }: { category: MenuCategory }) {
  return (
    <motion.ul className="grid gap-3 sm:grid-cols-2 md:gap-4" variants={listMotion} initial="hidden" animate="shown">
      {category.items.map((item) => (
        <motion.li key={item.name} variants={cardMotion} className="menu-card group flex flex-col border border-ink/10 bg-paper">
          {item.image && (
            <div className="aspect-[4/3] overflow-hidden rounded-t-[9px] bg-milk">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-[1.2rem] font-medium lowercase leading-snug">{item.name}</h4>
              <span className="shrink-0 font-display text-[1.35rem] tabular-nums">
                {item.price}
                {currency}
              </span>
            </div>
            {item.description && (
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/65">{item.description}</p>
            )}
            {item.tag && (
              <p className="mt-auto pt-5">
                <span className="inline-block rounded-full bg-milk px-3 py-1 text-[0.8rem] lowercase text-ink/70 transition-colors duration-300 group-hover:bg-sign group-hover:text-ink">
                  {item.tag}
                </span>
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
