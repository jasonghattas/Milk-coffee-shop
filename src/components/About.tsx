"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { photos } from "@/data/gallery";

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

  // The two photos drift at slightly different speeds as the section scrolls by.
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
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="overflow-hidden bg-milk pb-28 pt-20 md:pb-40 md:pt-32">
      <div className="shell grid gap-20 md:grid-cols-12 md:gap-8">
        <div className="relative md:col-span-6 md:self-start lg:col-span-5">
          <div data-drift="4">
            <Reveal kind="unmask">
              <Photo photo={photos.lounge} className="aspect-[4/5] w-[82%] md:w-full" />
            </Reveal>
          </div>
          <div data-drift="-10" className="absolute -bottom-12 right-0 w-[46%] md:-bottom-16 md:-right-5 md:w-[50%] lg:-bottom-12 lg:-right-16 lg:w-[52%]">
            <Reveal kind="unmask" delay={0.25}>
              <Photo
                photo={photos.latteCake}
                className="aspect-square shadow-[0_24px_60px_-20px_rgba(18,17,16,0.45)] ring-[5px] ring-milk"
              />
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-16 lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">Behind the blue door in Hlaliyeh</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[30rem] font-display text-[1.45rem] leading-snug text-ink md:text-[1.6rem]">
              Milk is a coffee shop and concept store in Hlaliyeh, Saida.
            </p>
            <p className="mt-5 max-w-[30rem] text-lg text-ink/75">
              Come in for a coffee, stay for a sando, and take whichever seat suits the day: a quiet corner by the
              patterned window, or a table out in the sun.
            </p>
            <p className="mt-4 max-w-[30rem] text-lg text-ink/75">
              It is a relaxed, welcoming place, built for unhurried mornings and long catch-ups.
            </p>
            <a href="#menu" className="btn btn-ink mt-9">
              See the menu
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-14 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3 xl:gap-6">
              {notes.map((note) => (
                <div key={note.title}>
                  <dt className="font-display text-xl lowercase">{note.title}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{note.body}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
