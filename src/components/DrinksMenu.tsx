"use client";

import { motion } from "framer-motion";
import type { PointerEvent } from "react";
import { DrinkGlyph } from "./DrinkGlyph";
import { cardMotion, listMotion } from "./menuMotion";
import { currency } from "@/data/menu";
import { drinksMenu } from "@/data/drinks";

/** Cards lean toward the pointer, like a cup picked up to look at. */
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const box = el.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  el.style.setProperty("--ry", `${x * 16}deg`);
  el.style.setProperty("--rx", `${-y * 16}deg`);
  el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
  el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
}
function untilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

/**
 * The Coffee tab of the menu: each group from src/data/drinks.ts as a shelf
 * of cards, every drink drawn in its own Milk cup.
 */
export function DrinksMenu() {
  return (
    <div className="space-y-14 md:space-y-16">
      {drinksMenu.map((group) => (
        <section key={group.id} aria-labelledby={`drinks-${group.id}`}>
          <div className="flex items-baseline justify-between gap-4 border-b border-milk/15 pb-4">
            <h3 id={`drinks-${group.id}`} className="text-[1.7rem] lowercase md:text-[2.1rem]">
              {group.name}
            </h3>
            <span className="font-display text-lg tabular-nums text-sign">{String(group.items.length).padStart(2, "0")}</span>
          </div>

          <motion.ul
            className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"
            variants={listMotion}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.05 }}
          >
            {group.items.map((drink) => (
              <motion.li key={drink.name} variants={cardMotion} className="[perspective:900px]">
                <div
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  className="drink-card group relative flex h-full flex-col items-center overflow-hidden rounded-[14px] bg-milk/[0.045] px-1.5 pb-4 pt-3 text-center sm:rounded-[18px] sm:px-3 sm:pb-5 sm:pt-6 ring-1 ring-milk/10 transition-[transform,background-color,box-shadow] duration-300 ease-out hover:bg-milk/[0.08] hover:shadow-[0_30px_50px_-30px_rgba(0,0,0,0.9)] hover:ring-sign/40"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(260px circle at var(--gx,50%) var(--gy,30%), rgba(246,215,67,0.22), transparent 60%)" }}
                  />
                  <span className="relative grid h-20 w-full place-items-center sm:h-28 md:h-32">
                    <span
                      aria-hidden
                      className="absolute bottom-2 h-2.5 w-10 rounded-[50%] sm:bottom-3 sm:h-3 sm:w-16 bg-black/50 blur-[6px] transition-all duration-500 group-hover:w-12 group-hover:opacity-60"
                    />
                    {drink.image ? (
                      <img src={drink.image} alt="" loading="lazy" decoding="async" className="h-24 w-20 rounded-[10px] object-cover" />
                    ) : (
                      <DrinkGlyph
                        tone={drink.tone}
                        iced={drink.iced}
                        className="relative h-[68px] w-auto transition-transform sm:h-24 duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2.5 group-hover:-rotate-[7deg] group-hover:scale-110 md:h-28"
                      />
                    )}
                  </span>
                  <span className="relative mt-2 block font-display text-[0.98rem] lowercase leading-tight sm:mt-3 sm:text-[1.15rem] md:text-[1.3rem]">
                    {drink.name}
                  </span>
                  {drink.description && <span className="relative mt-1 block text-sm text-milk/55">{drink.description}</span>}
                  <span className="relative mt-2 flex items-center gap-2 sm:mt-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.66rem] uppercase tracking-[0.16em] ${
                        drink.iced ? "bg-milk/10 text-milk/75" : "bg-oak/20 text-oak"
                      }`}
                    >
                      {drink.iced ? "iced" : "hot"}
                    </span>
                    {drink.price !== null && (
                      <span className="font-display text-[1.15rem] tabular-nums text-sign">
                        {drink.price}
                        {currency}
                      </span>
                    )}
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      ))}
    </div>
  );
}
