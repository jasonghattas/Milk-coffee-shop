"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { MapPin, Star } from "lucide-react";
import { useExperience } from "./Experience";
import { Logo } from "./Logo";
import { rating, site } from "@/data/site";
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
      <div className="absolute inset-0 -z-10">
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
        {mode === "fallback" && <FlatSign />}
      </div>

      <div className="shell flex h-full flex-col justify-start pt-[15svh] md:landscape:justify-center md:landscape:pt-0">
        <div className="max-w-[34rem] md:landscape:w-1/2">
          <p className="intro-hide font-display text-lg text-milk/70 md:text-xl" style={{ "--d": "0.05s" } as React.CSSProperties}>
            {site.name}
          </p>
          <h1
            className="intro-hide mt-3 text-[clamp(2.6rem,10.5vw,3.4rem)] lowercase md:mt-4 md:text-[clamp(3.4rem,6.2vw,5.75rem)]"
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            {site.headline}
          </h1>
          <p
            className="intro-hide mt-5 max-w-[26rem] text-base text-milk/75 md:mt-7 md:text-lg"
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
        className="intro-hide absolute inset-x-0 bottom-0 hidden md:landscape:block"
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

/** Hero visual when WebGL is not available: the wordmark, backlit like the shop sign. */
function FlatSign() {
  return (
    <div className="absolute inset-x-0 bottom-[12%] flex justify-center md:inset-y-0 md:bottom-auto md:left-1/2 md:items-center" aria-hidden>
      <div className="relative w-[58%] max-w-[420px]">
        <span className="wordmark absolute inset-0 scale-105 text-sign opacity-90 blur-xl" />
        <span className="wordmark absolute inset-0 text-sign blur-[3px]" />
        <Logo className="relative text-ink" />
      </div>
    </div>
  );
}

/** If the 3D scene throws, fall back to the flat hero instead of breaking the page. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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
