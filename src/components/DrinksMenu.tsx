"use client";

import { motion } from "framer-motion";
import { DrinkGlyph } from "./DrinkGlyph";
import { cardMotion, listMotion } from "./menuMotion";
import { currency } from "@/data/menu";
import { drinksMenu } from "@/data/drinks";

/**
 * The Coffee tab of the menu: each group from src/data/drinks.ts as a printed
 * list, every drink with its little cup beside the name.
 */
export function DrinksMenu() {
  return (
    <div className="space-y-12 md:space-y-14">
      {drinksMenu.map((group) => (
        <section key={group.id} aria-labelledby={`drinks-${group.id}`}>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
            <h3 id={`drinks-${group.id}`} className="text-[1.6rem] lowercase md:text-[1.9rem]">
              {group.name}
            </h3>
            <span className="text-sm tabular-nums text-ink/45">{group.items.length}</span>
          </div>

          <motion.ul className="grid gap-x-12 sm:grid-cols-2" variants={listMotion} initial="hidden" animate="shown">
            {group.items.map((drink) => (
              <motion.li
                key={drink.name}
                variants={cardMotion}
                className="group flex items-center gap-4 border-b border-ink/12 py-2 transition-colors duration-300 hover:border-ink/45"
              >
                <span className="grid h-14 w-11 shrink-0 place-items-center">
                  {drink.image ? (
                    <img src={drink.image} alt="" loading="lazy" decoding="async" className="h-11 w-10 rounded-[6px] object-cover" />
                  ) : (
                    <DrinkGlyph
                      tone={drink.tone}
                      iced={drink.iced}
                      className="h-14 w-11 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:scale-110"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.25rem] lowercase leading-snug md:text-[1.35rem]">{drink.name}</span>
                  {drink.description && <span className="mt-0.5 block text-sm text-ink/60">{drink.description}</span>}
                </span>
                {drink.price !== null && (
                  <span className="shrink-0 font-display text-[1.25rem] tabular-nums">
                    {drink.price}
                    {currency}
                  </span>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </section>
      ))}
    </div>
  );
}
