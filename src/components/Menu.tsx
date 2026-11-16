"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DrinksMenu } from "./DrinksMenu";
import { FoodMenu } from "./FoodMenu";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { foodMenu } from "@/data/menu";
import { drinksConfirmed, drinksMenu } from "@/data/drinks";
import { photos, type Photo as PhotoData } from "@/data/gallery";

/**
 * The whole menu in one place: Coffee first, then Food, then Salades.
 * The tabs swap the contents of a single panel; nothing is stacked.
 * Dishes come from src/data/menu.ts and drinks from src/data/drinks.ts.
 */
type Tab = { id: string; label: string; count: number; intro: string; photo: PhotoData };

const tabPhotos: Record<string, PhotoData> = {
  food: photos.sando,
  salades: photos.terrace,
};

const tabs: Tab[] = [
  {
    id: "coffee",
    label: "Coffee",
    count: drinksMenu.reduce((total, group) => total + group.items.length, 0),
    intro: "Espresso classics, iced signatures and a few things for the non-coffee crowd.",
    photo: photos.latteSun,
  },
  ...foodMenu.map((category) => ({
    id: category.id,
    label: category.name,
    count: category.items.length,
    intro: category.intro,
    photo: tabPhotos[category.id] ?? photos.interior,
  })),
];

export function Menu() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const panel = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    // If the visitor switched from deep inside a long list, bring the top of the panel back.
    const top = panel.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) panel.current?.scrollIntoView({ block: "start" });
  };

  // Arrow keys move between tabs, as a tab list should.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    select(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const category = foodMenu.find((item) => item.id === active.id);

  return (
    <section id="menu" className="bg-ink py-20 md:py-28">

      <div className="shell">
        <Reveal>
          <div ref={panel} className="scroll-mt-20 rounded-[14px] bg-paper ring-1 ring-sign/40">
            <header className="grid gap-5 px-5 pt-9 md:grid-cols-12 md:items-end md:px-12 md:pt-14">
              <div className="md:col-span-7">
                <p className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink/55">
                  <span className="h-px w-8 bg-sign" aria-hidden />
                  Made to order
                </p>
                <h2 className="mt-4 text-[clamp(2.6rem,6vw,4.75rem)] lowercase">The menu</h2>
              </div>
              <p className="max-w-[24rem] text-ink/65 md:col-span-5 md:justify-self-end md:pb-3">
                Coffee, sandos and salades. Prices are in US dollars.
              </p>
            </header>

            <div className="sticky top-16 z-20 mt-6 border-b border-ink/12 bg-paper/95 px-5 backdrop-blur md:mt-8 md:px-12">
              <div
                role="tablist"
                aria-label="Menu categories"
                onKeyDown={onKeyDown}
                className="flex gap-7 sm:gap-12"
              >
                {tabs.map((tab) => {
                  const selected = tab.id === active.id;
                  return (
                    <button
                      key={tab.id}
                      ref={(node) => {
                        tabRefs.current[tab.id] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls="menu-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(tab.id)}
                      className={`relative -mb-px min-h-[56px] pb-3 pt-4 font-display text-[1.45rem] lowercase transition-colors duration-300 sm:text-[1.8rem] ${
                        selected ? "text-ink" : "text-ink/40 hover:text-ink/75"
                      }`}
                    >
                      {tab.label}
                      <sup className="ml-1 font-sans text-[0.42em] tabular-nums opacity-70">{tab.count}</sup>
                      {selected && (
                        <motion.span
                          layoutId="menu-tab"
                          className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-sign"
                          transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id="menu-panel"
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              className="min-h-[560px] px-5 pb-9 pt-8 md:px-12 md:pb-14 md:pt-12"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  className="grid gap-9 lg:grid-cols-12 lg:gap-14"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-40">
                      <Photo photo={active.photo} className="aspect-[16/10] sm:aspect-[21/9] lg:aspect-[4/5]" />
                      <p className="mt-5 font-display text-[1.45rem] lowercase leading-tight">{active.intro}</p>
                      <p className="mt-2 text-sm text-ink/50">{active.photo.caption}</p>
                      {active.id === "coffee" && !drinksConfirmed && (
                        <p className="mt-4 border-l-2 border-sign pl-3 text-[0.92rem] text-ink/60">
                          Our drinks list is being finalised, so prices are not shown yet. Ask at the counter for
                          today&rsquo;s coffee.
                        </p>
                      )}
                    </div>
                  </aside>

                  <div className="lg:col-span-8">
                    {active.id === "coffee" ? <DrinksMenu /> : category ? <FoodMenu category={category} /> : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
