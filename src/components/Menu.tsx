"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DrinksMenu } from "./DrinksMenu";
import { FoodMenu } from "./FoodMenu";
import { Photo } from "./Photo";
import { foodMenu } from "@/data/menu";
import { drinksConfirmed, drinksMenu } from "@/data/drinks";
import { photos, type Photo as PhotoData } from "@/data/gallery";
import { gsap, reducedMotion } from "@/lib/motion";

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

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Menu() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // The title letters rise out of a slot when the section arrives.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-menu-letter]", {
        yPercent: 115,
        rotate: 6,
        duration: 1,
        stagger: 0.045,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-menu-title]", start: "top 85%", once: true },
      });
      gsap.from("[data-menu-sub]", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-menu-title]", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    // If the visitor switched from deep inside a long list, bring the top of the panel back.
    const top = panel.current?.getBoundingClientRect().top ?? 0;
    if (top < 140) panel.current?.scrollIntoView({ block: "start" });
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
    <section ref={root} id="menu" className="relative isolate overflow-clip bg-ink py-24 text-milk md:py-36">
      {/* the sign's glow, spilling into the room */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[18vw] -z-10 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(246,215,67,0.16),transparent)]"
      />

      <div className="shell">
        <header className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-milk/55">
              <span className="h-px w-8 bg-sign" aria-hidden />
              Made to order
            </p>
            <h2
              data-menu-title
              aria-label="The menu"
              className="mt-5 text-[clamp(4.2rem,15vw,11rem)] lowercase leading-[0.86] tracking-[-0.045em]"
            >
              {"the menu".split("").map((letter, i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-menu-letter className="inline-block">
                    {letter === " " ? " " : letter}
                  </span>
                </span>
              ))}
              <span aria-hidden className="text-sign">.</span>
            </h2>
          </div>
          <p data-menu-sub className="max-w-[22rem] text-lg text-milk/65 md:col-span-4 md:justify-self-end md:pb-5">
            Coffee, sandos and salades, made when you order them. Prices are in US dollars.
          </p>
        </header>
      </div>

      {/* Floating tab pill, sticks under the navigation while the menu is on screen */}
      <div className="sticky top-[76px] z-20 mt-12 md:mt-16">
        <div className="shell">
          <div
            role="tablist"
            aria-label="Menu categories"
            onKeyDown={onKeyDown}
            className="mx-auto flex w-fit max-w-full gap-1 rounded-full bg-[#1d1b19]/95 p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] ring-1 ring-milk/12"
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
                  className={`relative isolate min-h-[46px] rounded-full px-4 font-display text-[1.15rem] lowercase transition-colors duration-300 sm:px-7 sm:text-[1.35rem] ${
                    selected ? "text-ink" : "text-milk/60 hover:text-milk"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="menu-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-sign"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">
                    {tab.label}
                    <sup className="ml-1 font-sans text-[0.55em] tabular-nums opacity-70">{tab.count}</sup>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell">
        <div
          ref={panel}
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="mt-12 min-h-[560px] scroll-mt-[150px] md:mt-16"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className="grid gap-10 lg:grid-cols-12 lg:gap-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease }}
            >
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-40">
                  <motion.div
                    initial={{ clipPath: "inset(100% 0% 0% 0% round 18px)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0% round 18px)" }}
                    transition={{ duration: 0.8, ease }}
                    className="relative"
                  >
                    <Photo
                      photo={active.photo}
                      className="aspect-[16/10] rounded-[18px] sm:aspect-[21/9] lg:aspect-[4/5]"
                      imgClassName="scale-[1.02]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-milk backdrop-blur-sm">
                      {active.label}
                    </span>
                  </motion.div>
                  <p className="mt-6 font-display text-[1.5rem] lowercase leading-tight">{active.intro}</p>
                  <p className="mt-2 text-sm text-milk/45">{active.photo.caption}</p>
                  {active.id === "coffee" && !drinksConfirmed && (
                    <p className="mt-5 border-l-2 border-sign pl-3 text-[0.92rem] text-milk/60">
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
    </section>
  );
}
