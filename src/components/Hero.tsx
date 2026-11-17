"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { MapPin, Star } from "lucide-react";
import { useExperience } from "./Experience";
import { rating, site } from "@/data/site";
import { photos } from "@/data/gallery";
import { prefersReducedMotion } from "@/lib/intro";

// The 3D scene is the heaviest part of the site, so it loads on its own,
// after the page itself is readable.
const IntroCanvas = dynamic(() => import("./intro/IntroCanvas"), { ssr: false });

export function Hero() {
  const { mode, runId, started, skipSignal, reportProgress, sceneReady, reveal, fail } = useExperience();
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setLowPower(window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4);
    setStill(prefersReducedMotion());
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.02 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mode === "intro") reportProgress(30);
  }, [mode, reportProgress]);

  const with3D = mode === "intro" || mode === "static";

  return (
    <section ref={section} id="top" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-ink text-milk">
      {/* Layer 1: the shop sign at night, the one photograph that says where you are. */}
      <figure
        className="intro-hide hero-photo absolute inset-x-6 bottom-6 z-0 h-[33svh] md:inset-x-10 md:h-[42svh] md:landscape:inset-x-auto md:landscape:bottom-auto md:landscape:right-10 md:landscape:top-[47%] md:landscape:h-auto md:landscape:w-[41vw] md:landscape:max-w-[620px] md:landscape:-translate-y-1/2 xl:landscape:right-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]"
        style={{ "--d": "0.1s" } as React.CSSProperties}
      >
        <div className="h-full overflow-hidden rounded-[var(--radius-media)] md:landscape:aspect-[4/3]">
          <img
            src={photos.storefront.src}
            alt={photos.storefront.alt}
            width={photos.storefront.width}
            height={photos.storefront.height}
            decoding="async"
            className="hero-photo-img h-full w-full object-cover object-[50%_12%] md:object-[50%_30%]"
          />
        </div>
        <figcaption className="absolute -bottom-7 right-0 hidden text-sm text-milk/50 md:landscape:block">
          The sign over the door, {site.address.split(",")[0]}
        </figcaption>
      </figure>

      {/* Layer 2: the 3D cup, which stands in front of the photograph. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {with3D && (
          <SceneBoundary onError={fail}>
            <IntroCanvas
              key={runId}
              play={mode === "intro"}
              started={started}
              skipSignal={skipSignal}
              active={inView}
              lowPower={lowPower}
              still={still}
              onProgress={reportProgress}
              onReady={sceneReady}
              onReveal={reveal}
            />
          </SceneBoundary>
        )}
      </div>

      {/* Layer 3: the words. */}
      <div className="shell relative z-20 flex h-full flex-col justify-start pt-[13svh] md:landscape:justify-center md:landscape:pb-10 md:landscape:pt-0">
        <div className="max-w-[36rem] md:landscape:w-[46%]">
          <p
            className="intro-hide flex items-center gap-3 font-display text-lg text-milk/70 md:text-xl"
            style={{ "--d": "0.05s" } as React.CSSProperties}
          >
            <span className="h-px w-8 bg-sign" aria-hidden />
            {site.name}
          </p>
          <h1
            className="intro-hide mt-4 text-[clamp(2.7rem,11vw,3.6rem)] lowercase leading-[0.98] md:mt-5 md:text-[clamp(3.5rem,6.4vw,6.25rem)]"
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            {site.headline}
          </h1>
          <p
            className="intro-hide mt-5 max-w-[25rem] text-base text-milk/75 md:mt-7 md:text-lg"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            {site.description}
          </p>
          <div className="intro-hide mt-7 flex flex-wrap gap-3 md:mt-9" style={{ "--d": "0.42s" } as React.CSSProperties}>
            <a href="#menu" className="btn btn-sign">Explore our menu</a>
            <a href="#contact" className="btn btn-ghost">Find us</a>
          </div>
        </div>
      </div>

      <div
        className="intro-hide absolute inset-x-0 bottom-0 z-20 hidden md:landscape:block"
        style={{ "--d": "0.6s" } as React.CSSProperties}
      >
        <div className="shell flex items-center gap-10 border-t border-milk/10 py-5 text-sm text-milk/65">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} aria-hidden /> {site.address}
          </span>
          <a href={rating.listingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-milk">
            <Star size={16} className="fill-sign text-sign" aria-hidden />
            {rating.score} on Google, from {rating.count} reviews
          </a>
        </div>
      </div>
    </section>
  );
}

/** If the 3D scene throws, fall back to the flat hero instead of breaking the page. */
export class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
