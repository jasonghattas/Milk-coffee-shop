"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gallery } from "@/data/gallery";
import { gsap } from "@/lib/motion";

/**
 * A walk around Milk. On wide screens the section holds still and the
 * photographs slide past sideways as the visitor scrolls; on phones it is a
 * row to swipe through. Any photo opens full screen.
 */

// Desktop: heights (share of the screen) and a gentle up/down offset, so the row reads like a wall of prints.
const frames = [
  "lg:h-[54svh] lg:-translate-y-[5svh]",
  "lg:h-[70svh] lg:translate-y-[3svh]",
  "lg:h-[42svh] lg:translate-y-[12svh]",
  "lg:h-[62svh] lg:-translate-y-[6svh]",
  "lg:h-[48svh] lg:translate-y-[8svh]",
  "lg:h-[66svh] lg:-translate-y-[2svh]",
  "lg:h-[44svh] lg:translate-y-[10svh]",
  "lg:h-[56svh] lg:-translate-y-[4svh]",
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // The sideways ride (desktop only, and only for visitors who are fine with motion).
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = node.querySelector<HTMLElement>("[data-pin]")!;
      const track = node.querySelector<HTMLElement>("[data-track]")!;
      const count = node.querySelector<HTMLElement>("[data-gal-count]");
      const bar = node.querySelector<HTMLElement>("[data-bar]");
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const ride = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            if (count) count.textContent = String(Math.min(gallery.length, Math.floor(self.progress * gallery.length) + 1)).padStart(2, "0");
          },
        },
      });
      // Each print shifts a little inside its frame as it passes: depth without 3D.
      node.querySelectorAll<HTMLElement>("[data-print]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7, scale: 1.18 },
          {
            xPercent: 7,
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: ride, start: "left right", end: "right left", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((by: number) => {
    setOpen((index) => (index === null ? index : (index + by + gallery.length) % gallery.length));
  }, []);

  // Full-screen viewer: lock the page, move focus in, and listen for the keyboard.
  useEffect(() => {
    if (open === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open === null, close, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = open === null ? null : gallery[open];

  return (
    <section ref={root} id="gallery" className="relative bg-milk text-ink">
      <div data-pin className="relative overflow-hidden py-24 md:py-32 lg:h-[100svh] lg:py-0">
        <div
          data-track
          className="flex flex-col gap-12 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[3.5vw] lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] lg:pr-[8vw]"
        >
          {/* Opening panel */}
          <header className="shell lg:w-[34vw] lg:max-w-[520px] lg:shrink-0 lg:px-0">
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink/55">
              <span className="h-px w-8 bg-sign" aria-hidden />
              Photographed at Milk
            </p>
            <h2
              className="mt-5 text-[clamp(3.4rem,8vw,7.5rem)] lowercase leading-[0.9] tracking-[-0.04em]"
            >
              a look
              <br />
              around<span className="text-sign">.</span>
            </h2>
            <p className="mt-6 max-w-[24rem] text-lg text-ink/65">
              Coffee, sandos and the corners people settle into. Tap any photo to see it bigger.
            </p>
            <p className="mt-8 hidden items-center gap-3 text-sm uppercase tracking-[0.2em] text-ink/45 lg:flex" aria-hidden>
              Keep scrolling <ArrowRight size={16} className="animate-[nudge_1.6s_ease-in-out_infinite]" />
            </p>
          </header>

          {/* The prints */}
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] md:gap-4 md:px-10 lg:snap-none lg:items-center lg:gap-[3.5vw] lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden">
            {gallery.map((photo, index) => (
              <li key={photo.src} className={`shrink-0 snap-start ${frames[index % frames.length]}`}>
                <button
                  type="button"
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setOpen(index);
                  }}
                  aria-label={`View larger: ${photo.caption}`}
                  className="group relative block h-full cursor-zoom-in text-left"
                >
                  <span className="block aspect-[4/5] w-[78vw] max-w-[420px] overflow-hidden rounded-[18px] bg-ink/10 sm:w-[46vw] lg:aspect-auto lg:h-[calc(100%-2.25rem)] lg:w-auto lg:max-w-none">
                    <img
                      data-print
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-[1.06] lg:w-auto lg:max-w-none"
                      style={photo.focus ? { objectPosition: photo.focus } : undefined}
                    />
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-baseline gap-3">
                      <span className="font-display tabular-nums text-ink/35">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-ink/70">{photo.caption}</span>
                    </span>
                    <Expand size={15} aria-hidden className="shrink-0 text-ink/40 transition-colors group-hover:text-ink" />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Closing panel */}
          <div className="shell lg:w-[26vw] lg:max-w-[400px] lg:shrink-0 lg:px-0">
            <p className="font-display text-[clamp(2rem,3.4vw,3rem)] lowercase leading-[1.02]">
              better in person<span className="text-sign">.</span>
            </p>
            <a href="#contact" className="btn btn-ink group mt-6">
              Plan a visit
              <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Ride progress (desktop) */}
        <div aria-hidden className="pointer-events-none absolute bottom-8 left-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] hidden items-center gap-4 text-sm tabular-nums text-ink/55 lg:flex">
          <span>
            <span data-gal-count>01</span> / {String(gallery.length).padStart(2, "0")}
          </span>
          <span className="relative h-[2px] w-40 overflow-hidden rounded-full bg-ink/12">
            <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-ink" />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${open + 1} of ${gallery.length}: ${current.caption}`}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 text-milk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <p className="text-sm tabular-nums text-milk/60">
                {open + 1} / {gallery.length}
              </p>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                aria-label="Close photo"
                className="grid h-11 w-11 place-items-center rounded-full border border-milk/25 transition-colors hover:border-milk hover:bg-milk/10"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  className="max-h-full w-auto max-w-full rounded-[14px] object-contain"
                  style={{ maxWidth: `min(100%, ${current.width * 1.5}px)` }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                  onClick={(event) => event.stopPropagation()}
                />
              </AnimatePresence>

              {[-1, 1].map((by) => (
                <button
                  key={by}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(by);
                  }}
                  aria-label={by < 0 ? "Previous photo" : "Next photo"}
                  className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-milk/25 bg-ink/60 transition-colors hover:border-sign hover:bg-sign hover:text-ink ${
                    by < 0 ? "left-3 md:left-6" : "right-3 md:right-6"
                  }`}
                >
                  {by < 0 ? <ChevronLeft size={22} aria-hidden /> : <ChevronRight size={22} aria-hidden />}
                </button>
              ))}
            </div>

            <p className="px-5 py-5 text-center font-display text-xl lowercase md:py-6">{current.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
