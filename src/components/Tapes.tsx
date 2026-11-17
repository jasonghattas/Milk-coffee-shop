"use client";

import { Fragment, useEffect, useRef } from "react";
import { DrinkGlyph } from "./DrinkGlyph";
import { reducedMotion } from "@/lib/motion";

/**
 * The seam under the hero: two strips of tape crossing each other, one
 * yellow like the sign, one black like the wordmark. They drift on their
 * own, speed up with the scroll and turn round when the visitor scrolls back.
 */
const yellowWords = ["coffee", "sandos", "salades", "good company"];
const blackWords = ["hlaliyeh", "saida", "made to order", "stay a while"];

function Run({ words, dark }: { words: string[]; dark: boolean }) {
  return (
    <div className="flex shrink-0 items-center">
      {[0, 1].map((round) =>
        words.map((word, i) => (
          <Fragment key={`${round}-${word}`}>
            <span className="whitespace-nowrap px-6 font-display text-[clamp(1.9rem,5vw,4rem)] lowercase leading-none md:px-10">
              {word}
            </span>
            {dark ? (
              <span className="wordmark w-[74px] shrink-0 text-sign md:w-[104px]" />
            ) : (
              <DrinkGlyph
                tone={i % 2 ? "espresso" : "latte"}
                iced={i % 2 === 1}
                className="h-[46px] w-auto shrink-0 md:h-[66px]"
              />
            )}
          </Fragment>
        )),
      )}
    </div>
  );
}

export function Tapes() {
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion()) return;
    const node = root.current;
    if (!node) return;
    let visible = false;
    let raf = 0;
    let lastY = window.scrollY;
    let direction = 1;
    let boost = 0;
    const offsets = [0, 0];
    // Measure once (and on resize), never inside the animation frame.
    let halves = [1, 1];
    const measure = () => {
      halves = tracks.current.map((track) => (track ? track.scrollWidth / 2 : 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    tracks.current.forEach((track) => track && ro.observe(track));

    const tick = () => {
      raf = 0;
      if (!visible) return;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) > 0.5) direction = delta > 0 ? 1 : -1;
      boost += (Math.min(Math.abs(delta), 80) * 0.35 - boost) * 0.12;
      const speed = (0.55 + boost) * direction;
      tracks.current.forEach((track, index) => {
        if (!track) return;
        const half = halves[index];
        offsets[index] = (offsets[index] + speed * (index ? -1 : 1)) % half;
        if (offsets[index] > 0) offsets[index] -= half;
        track.style.transform = `translate3d(${offsets[index]}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastY = window.scrollY;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(node);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="relative isolate h-[200px] overflow-hidden bg-milk md:h-[300px]">
      {/* black tape, behind */}
      <div className="absolute left-[-10%] top-1/2 w-[120%] -translate-y-1/2 rotate-[2.5deg] bg-ink py-3 text-milk shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)] md:py-5">
        <div ref={(el) => { tracks.current[1] = el; }} className="flex w-max will-change-transform">
          <Run words={blackWords} dark />
          <Run words={blackWords} dark />
        </div>
      </div>
      {/* yellow tape, in front */}
      <div className="absolute left-[-10%] top-1/2 z-10 w-[120%] -translate-y-1/2 -rotate-[3.5deg] bg-sign py-3 text-ink shadow-[0_24px_50px_-26px_rgba(18,17,16,0.55)] md:py-5">
        <div ref={(el) => { tracks.current[0] = el; }} className="flex w-max will-change-transform">
          <Run words={yellowWords} dark={false} />
          <Run words={yellowWords} dark={false} />
        </div>
      </div>
    </div>
  );
}
