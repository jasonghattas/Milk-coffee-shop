"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { gallery } from "@/data/gallery";

// Layout of the six tiles on wide screens: an uneven grid rather than a strip of equal boxes.
const spans = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5 md:row-span-3",
  "md:col-span-3 md:row-span-3",
  "md:col-span-4 md:row-span-2",
  "md:col-span-5 md:row-span-2",
  "md:col-span-4 md:row-span-1",
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

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
    <section id="gallery" className="bg-milk py-24 md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">A look around</h2>
          <p className="max-w-[24rem] text-ink/70">Coffee, sandos and the corners people settle into, photographed at Milk.</p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:auto-rows-[132px] md:grid-cols-12 md:gap-4">
          {gallery.map((photo, index) => (
            <li
              key={photo.src}
              className={`${index === 0 || index === gallery.length - 1 ? "col-span-2" : ""} ${spans[index % spans.length]}`}
            >
              <Reveal kind="unmask" delay={(index % 3) * 0.08} className="h-full">
                <button
                  type="button"
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setOpen(index);
                  }}
                  aria-label={`View larger: ${photo.caption}`}
                  className="group relative block h-full w-full cursor-zoom-in rounded-[var(--radius-media)] text-left"
                >
                  <Photo
                    photo={photo}
                    className="aspect-[4/3] h-full md:aspect-auto"
                    imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 rounded-b-[var(--radius-media)] bg-gradient-to-t from-ink/75 to-transparent px-4 pb-3 pt-12 text-sm text-milk transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    <span>{photo.caption}</span>
                    <Expand size={16} aria-hidden className="shrink-0 opacity-80" />
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${open + 1} of ${gallery.length}: ${current.caption}`}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 text-milk backdrop-blur-sm"
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
                  className="max-h-full w-auto max-w-full rounded-[var(--radius-media)] object-contain"
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
