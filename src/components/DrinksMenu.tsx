"use client";

import { motion } from "framer-motion";
import { DrinkGlyph } from "./DrinkGlyph";
import { cardMotion, listMotion } from "./menuMotion";
import { currency } from "@/data/menu";
import { drinksMenu } from "@/data/drinks";

/** The Coffee tab of the menu. Everything shown here comes from src/data/drinks.ts. */
export function DrinksMenu() {
  return (
    <div className="space-y-12">
      {drinksMenu.map((group) => (
        <section key={group.id} aria-labelledby={`drinks-${group.id}`}>
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/12 pb-3">
            <h3 id={`drinks-${group.id}`} className="text-[1.6rem] lowercase md:text-[1.75rem]">
              {group.name}
            </h3>
            <span className="text-sm tabular-nums text-ink/45">{group.items.length}</span>
          </div>

          <motion.ul
            className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4"
            variants={listMotion}
            initial="hidden"
            animate="shown"
          >
            {group.items.map((drink) => (
              <motion.li key={drink.name} variants={cardMotion} className="menu-card group bg-milk p-2.5 pb-4 md:p-3 md:pb-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[7px] bg-paper">
                  {drink.image ? (
                    <img src={drink.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <DrinkGlyph
                      tone={drink.tone}
                      iced={drink.iced}
                      className="absolute inset-x-0 top-[7%] mx-auto h-[86%] w-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
                  <h4 className="text-[1rem] font-medium lowercase leading-snug md:text-[1.05rem]">{drink.name}</h4>
                  {drink.price !== null && (
                    <span className="shrink-0 font-display text-lg tabular-nums">
                      {drink.price}
                      {currency}
                    </span>
                  )}
                </div>
                {drink.description && <p className="mt-1 px-1 text-sm text-ink/60">{drink.description}</p>}
              </motion.li>
            ))}
          </motion.ul>
        </section>
      ))}
    </div>
  );
}
