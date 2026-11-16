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
            <header className="grid gap-6 px-5 pt-8 md:grid-cols-12 md:items-end md:px-10 md:pt-12">
              <div className="md:col-span-7">
                <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">The menu</h2>
              </div>
              <p className="max-w-[24rem] text-ink/65 md:col-span-5 md:justify-self-end md:pb-2">
                Coffee, sandos and salades, made to order. Prices are in US dollars.
              </p>
            </header>

            <div className="sticky top-16 z-20 mt-7 rounded-t-none border-b border-ink/10 bg-paper/95 px-5 py-3 backdrop-blur md:mt-9 md:px-10">
              <div
                role="tablist"
                aria-label="Menu categories"
                onKeyDown={onKeyDown}
                className="grid w-full grid-cols-3 rounded-full bg-milk p-1 sm:inline-grid sm:w-auto"
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
                      className={`relative min-h-[46px] rounded-full px-3 text-[0.98rem] lowercase transition-colors duration-300 sm:px-7 ${
                        selected ? "text-milk" : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="menu-tab"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative">
                        {tab.label}
                        <span className="ml-1.5 text-[0.8em] tabular-nums opacity-55">{tab.count}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id="menu-panel"
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              className="min-h-[560px] px-5 pb-8 pt-8 md:px-10 md:pb-12 md:pt-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  className="grid gap-8 lg:grid-cols-12 lg:gap-10"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-40">
                      <Photo photo={active.photo} className="aspect-[16/10] sm:aspect-[21/9] lg:aspect-[4/5]" />
                      <p className="mt-5 font-display text-[1.45rem] lowercase leading-tight">{active.intro}</p>
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
