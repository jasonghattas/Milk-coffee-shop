"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { useExperience } from "./Experience";
import { links, nav, site } from "@/data/site";

/**
 * The last thing on the page is the first thing you see in Hlaliyeh at
 * night: the Milk sign. It sits dark on the wall until it scrolls into view,
 * then flickers on and glows yellow, like the real one over the door.
 */
export function Footer() {
  const { canReplay, replay } = useExperience();
  const sign = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = sign.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="relative overflow-hidden bg-ink text-milk">
      <div className="stitch-band opacity-30" aria-hidden />

      <div className="shell grid gap-12 pt-16 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <p className="max-w-[22rem] font-display text-[1.9rem] lowercase leading-[1.05] md:text-[2.3rem]">
            your daily ritual, <span className="text-sign">elevated.</span>
          </p>
          <p className="mt-5 max-w-[20rem] text-milk/55">
            {site.category} and concept store in {site.address}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <p className="text-xs uppercase tracking-[0.2em] text-milk/40">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="group inline-flex items-center gap-2 text-milk/75 transition-colors hover:text-milk">
                  <span className="h-px w-0 bg-sign transition-all duration-300 group-hover:w-4" aria-hidden />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-milk/40">Say hello</p>
          <div className="mt-4 space-y-2.5">
            <p>
              <a href={links.phone} className="underline-link">
                {site.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={links.whatsapp} target="_blank" rel="noreferrer" className="underline-link">
                WhatsApp
              </a>
            </p>
            {canReplay && (
              <p className="pt-2">
                <button
                  type="button"
                  onClick={replay}
                  className="inline-flex min-h-[44px] items-center gap-2 text-milk/75 transition-colors hover:text-sign"
                >
                  <RotateCcw size={16} aria-hidden /> Replay the intro
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The sign on the wall */}
      <div
        ref={sign}
        aria-hidden
        className={`sign-wall relative mt-16 py-12 md:mt-24 md:py-20 ${on ? "is-on" : ""}`}
      >
        <span className="sign-spill pointer-events-none absolute inset-0" />
        <div className="shell relative">
          <div className="relative">
            <div className="sign-halo absolute inset-0">
              <span className="wordmark w-full text-sign" />
            </div>
            <div className="sign-rim relative">
              <span className="wordmark w-full text-[#0d0c0b]" />
            </div>
          </div>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-milk/10 py-6 text-sm text-milk/45">
        <span>
          © {new Date().getFullYear()} {site.name} · Hlaliyeh, Saida
        </span>
        <a href="#top" className="group inline-flex min-h-[44px] items-center gap-2 text-milk/60 transition-colors hover:text-sign">
          Back to top
          <ArrowUp size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1" />
        </a>
      </div>
    </footer>
  );
}
