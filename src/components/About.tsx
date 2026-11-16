"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { photos } from "@/data/gallery";
import { site } from "@/data/site";

const notes = [
  {
    title: "Coffee first",
    body: "Hot or over ice, made to order and handed over in the cup with our name on it.",
  },
  {
    title: "Inside or out",
    body: "Oak tables and soft chairs indoors; outside, a terrace with daisies painted across the paving.",
  },
  {
    title: "Better with friends",
    body: "Order a couple of sandos, pull the chairs together and let the afternoon run long.",
  },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  // The two small photos drift a little against the large one as the section scrolls by.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift);
        gsap.fromTo(
          el,
          { yPercent: amount },
          {
            yPercent: -amount,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="overflow-hidden bg-milk py-24 md:py-36">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* The story */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink/55">
              <span className="h-px w-8 bg-sign" aria-hidden />
              Discover Milk
            </p>
            <h2 className="mt-5 text-[clamp(2.6rem,6vw,4.75rem)] leading-[1]">
              More than coffee. A place to belong.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[30rem] font-display text-[1.4rem] leading-snug text-ink md:text-[1.55rem]">
              Milk is a coffee shop and concept store in Hlaliyeh, Saida.
            </p>
            <p className="mt-5 max-w-[30rem] text-lg text-ink/70">
              Come in for a coffee, stay for a sando, and take whichever seat suits the day: a quiet corner by the
              patterned window, or a table out in the sun. It is a relaxed, welcoming place, built for unhurried
              mornings and long catch-ups.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
              <a href="#menu" className="btn btn-ink">
                See the menu
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 text-ink/75 transition-colors hover:text-ink">
                <MapPin size={18} className="text-ink" aria-hidden />
                <span className="underline-link">{site.address}</span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* The photographs: one large, two small, deliberately off-grid */}
        <div className="relative isolate lg:col-span-6 lg:col-start-7">
          <div className="grid grid-cols-12 items-start gap-3 md:gap-4">
            <Reveal kind="unmask" className="col-span-8">
              <figure>
                <Photo photo={photos.lounge} className="aspect-[4/5]" />
                <figcaption className="mt-3 text-sm text-ink/50">{photos.lounge.caption}</figcaption>
              </figure>
            </Reveal>
            <div className="col-span-4 space-y-3 pt-[22%] md:space-y-4">
              <div data-drift="-6">
                <Reveal kind="unmask" delay={0.15}>
                  <Photo photo={photos.interior} className="aspect-[3/4]" />
                </Reveal>
              </div>
              <div data-drift="-12">
                <Reveal kind="unmask" delay={0.3}>
                  <Photo photo={photos.latteCake} className="aspect-square" />
                </Reveal>
              </div>
            </div>
          </div>
          <span
            aria-hidden
            className="absolute -right-3 top-[6%] -z-10 hidden h-[38%] w-[30%] rounded-[var(--radius-media)] bg-sign md:block"
          />
        </div>
      </div>

      <div className="shell">
        <Reveal>
          <dl className="mt-20 grid gap-8 border-t border-ink/15 pt-9 sm:grid-cols-3 md:mt-28 md:gap-12">
            {notes.map((note) => (
              <div key={note.title}>
                <dt className="font-display text-[1.45rem] lowercase">{note.title}</dt>
                <dd className="mt-2 max-w-[22rem] text-[0.95rem] leading-relaxed text-ink/65">{note.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
