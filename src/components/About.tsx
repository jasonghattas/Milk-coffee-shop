"use client";

import { Fragment, useEffect, useRef } from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { Photo } from "./Photo";
import { photos, type Photo as PhotoData } from "@/data/gallery";
import { foodMenu } from "@/data/menu";
import { drinksMenu } from "@/data/drinks";
import { site } from "@/data/site";
import { gsap, reducedMotion } from "@/lib/motion";

/**
 * About Milk, told as one big sentence that lights up word by word as it
 * scrolls past, with small photographs tucked into the line where they belong.
 */
type Token = { word: string; mark?: boolean } | { photo: PhotoData };

const line = (text: string, marks: string[] = []): Token[] =>
  text.split(" ").map((word) => ({ word, mark: marks.includes(word) }));

const manifesto: Token[] = [
  ...line("More than coffee. A place to", []),
  ...line("belong.", ["belong."]),
  ...line("Come in for a coffee"),
  { photo: photos.latteSun },
  ...line("stay for a sando"),
  { photo: photos.sando },
  ...line("and take whichever seat suits the day:"),
  { photo: photos.lounge },
  ...line("a quiet corner by the patterned window, or a table out in the", []),
  ...line("sun.", ["sun."]),
  { photo: photos.terrace },
];

const plain = manifesto.map((t) => ("word" in t ? t.word : "")).filter(Boolean).join(" ");

const coffees = drinksMenu.reduce((total, group) => total + group.items.length, 0);
const sandos = foodMenu.find((c) => c.id === "food")?.items.length ?? 0;
const salades = foodMenu.find((c) => c.id === "salades")?.items.length ?? 0;
const stats = [
  { value: coffees, decimals: 0, label: "coffees and drinks", suffix: "" },
  { value: sandos, decimals: 0, label: "sandos on the menu", suffix: "" },
  { value: salades, decimals: 0, label: "big salades", suffix: "" },
];

const notes = [
  { title: "Coffee first", body: "Hot or over ice, made to order and handed over in the cup with our name on it." },
  { title: "Inside or out", body: "Oak tables and soft chairs indoors; outside, a terrace with daisies painted across the paving." },
  { title: "Better with friends", body: "Order a couple of sandos, pull the chairs together and let the afternoon run long." },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      // 1. The sentence lights up as it scrolls by.
      const tokens = gsap.utils.toArray<HTMLElement>("[data-tok]");
      const words = tokens.filter((el) => el.dataset.tok === "word");
      const pills = tokens.filter((el) => el.dataset.tok === "photo");
      const marks = tokens.filter((el) => el.dataset.mark === "1");
      gsap.set(words, { opacity: 0.14 });
      gsap.set(pills, { scale: 0, rotate: -12 });
      gsap.set(marks, { backgroundSize: "0% 0.32em" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 42%", scrub: 0.6 },
      });
      tokens.forEach((el, i) => {
        const at = i * 0.12;
        if (el.dataset.tok === "photo") tl.to(el, { scale: 1, rotate: 0, ease: "back.out(2)", duration: 0.5 }, at);
        else tl.to(el, { opacity: 1, ease: "none", duration: 0.3 }, at);
        if (el.dataset.mark === "1") tl.to(el, { backgroundSize: "100% 0.32em", ease: "power2.out", duration: 0.5 }, at + 0.15);
      });

      // 2. The big photo zooms out inside its frame; the small ones drift against it.
      gsap.fromTo(
        "[data-zoom] img",
        { scale: 1.28 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-zoom]", start: "top bottom", end: "bottom 30%", scrub: 0.6 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift);
        gsap.fromTo(
          el,
          { yPercent: amount },
          { yPercent: -amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });

      // 3. The round badge turns a little more as the page moves.
      gsap.to("[data-badge]", {
        rotate: 220,
        ease: "none",
        scrollTrigger: { trigger: "[data-collage]", start: "top bottom", end: "bottom top", scrub: 0.8 },
      });

      // 4. The numbers count up once.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals);
        const state = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = state.v.toFixed(decimals);
          },
        });
      });

      // 5. Notes rise one after the other.
      gsap.from("[data-note]", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-notes]", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-milk pb-24 pt-16 md:pb-36 md:pt-24">
      <div className="shell">
        <p className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-ink/55">
          <span className="h-px w-8 bg-sign" aria-hidden />
          Discover Milk
        </p>
        <h2 className="sr-only">About Milk</h2>

        <p
          data-manifesto
          aria-label={plain}
          className="mt-8 max-w-[1120px] font-display text-[clamp(2rem,4.9vw,4.4rem)] leading-[1.1] tracking-[-0.025em] md:mt-10"
        >
          {manifesto.map((token, i) => (
            <Fragment key={i}>
              {"word" in token ? (
                <span
                  aria-hidden
                  data-tok="word"
                  data-mark={token.mark ? "1" : undefined}
                  className={
                    token.mark
                      ? "bg-[linear-gradient(var(--color-sign),var(--color-sign))] bg-[length:100%_0.32em] bg-[position:0_88%] bg-no-repeat"
                      : undefined
                  }
                >
                  {token.word}
                </span>
              ) : (
                <span
                  aria-hidden
                  data-tok="photo"
                  className="mx-[0.06em] inline-block h-[0.82em] w-[1.55em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline ring-2 ring-milk shadow-[0_10px_24px_-12px_rgba(18,17,16,0.6)]"
                >
                  <img
                    src={token.photo.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={token.photo.focus ? { objectPosition: token.photo.focus } : undefined}
                  />
                </span>
              )}{" "}
            </Fragment>
          ))}
        </p>
      </div>

      <div className="shell mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* The facts */}
        <div className="lg:col-span-5">
          <p className="max-w-[28rem] font-display text-[1.45rem] leading-snug md:text-[1.65rem]">
            Milk is a coffee shop and concept store in Hlaliyeh, Saida, built for unhurried mornings and long
            catch-ups.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 border-t border-ink/15 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-[clamp(2.6rem,5vw,3.8rem)] leading-none tabular-nums">
                    <span data-count={stat.value} data-decimals={stat.decimals}>
                      {stat.value.toFixed(stat.decimals)}
                    </span>
                    {stat.suffix && <span className="ml-1 text-[0.55em] text-oak">{stat.suffix}</span>}
                  </span>
                  <span aria-hidden className="mt-2 block text-sm text-ink/55">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
            <a href="#menu" className="btn btn-ink group">
              See the menu
              <ArrowDownRight size={18} aria-hidden className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 text-ink/75 transition-colors hover:text-ink">
              <MapPin size={18} className="text-ink" aria-hidden />
              <span className="underline-link">{site.address}</span>
            </a>
          </div>
        </div>

        {/* The photographs */}
        <div data-collage className="relative lg:col-span-7">
          <div className="grid grid-cols-12 items-start gap-3 md:gap-4">
            <figure className="col-span-8">
              <div data-zoom>
                <Photo photo={photos.lounge} className="aspect-[4/5] rounded-[18px]" />
              </div>
              <figcaption className="mt-3 text-sm text-ink/50">{photos.lounge.caption}</figcaption>
            </figure>
            <div className="col-span-4 space-y-3 pt-[18%] md:space-y-4">
              <div data-drift="-10">
                <Photo photo={photos.interior} className="aspect-[3/4] rounded-[14px]" />
              </div>
              <div data-drift="-22">
                <Photo photo={photos.latteCake} className="aspect-square rounded-[14px]" />
              </div>
            </div>
          </div>

          {/* Spinning badge, like a sticker on the window */}
          <div
            aria-hidden
            className="absolute -left-4 bottom-[12%] h-[118px] w-[118px] md:-left-12 md:h-[156px] md:w-[156px]"
          >
            <div data-badge className="h-full w-full">
              <svg viewBox="0 0 200 200" className="badge-spin h-full w-full">
                <defs>
                  <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <circle cx="100" cy="100" r="99" fill="var(--color-ink)" />
                <text fill="var(--color-milk)" fontSize="17" letterSpacing="4.2" fontFamily="var(--font-sans)" fontWeight="500">
                  <textPath href="#badge-circle">MILK CONCEPT STORE ✺ HLALIYEH ✺ SAIDA ✺</textPath>
                </text>
              </svg>
            </div>
            <span className="absolute inset-[31%] grid place-items-center rounded-full bg-sign">
              <span className="wordmark w-[72%] text-ink" />
            </span>
          </div>
        </div>
      </div>

      <div className="shell">
        <ol data-notes className="mt-24 grid gap-4 sm:grid-cols-3 md:mt-32 md:gap-5">
          {notes.map((note, i) => (
            <li
              key={note.title}
              data-note
              className="group relative overflow-hidden rounded-[18px] bg-paper p-7 ring-1 ring-ink/8 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-34px_rgba(18,17,16,0.45)] md:p-9"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sign transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100"
              />
              <span className="font-display text-sm tabular-nums text-ink/40">0{i + 1}</span>
              <h3 className="mt-6 text-[1.7rem] lowercase md:text-[1.95rem]">{note.title}</h3>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-ink/65">{note.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
