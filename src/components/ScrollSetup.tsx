"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/motion";

/**
 * Page-wide scroll plumbing:
 *  - a thin yellow progress line along the top of the window;
 *  - re-measures every scroll animation when the layout settles (fonts,
 *    photos, a menu tab of a different length, and the moment the intro
 *    hands the page back), so pinned sections never start in the wrong place.
 */
export function ScrollSetup() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    paint();

    const refresh = () => ScrollTrigger.refresh();

    // A link straight to a section (milk.../#menu): the browser jumps there before the
    // scroll animations have reshaped the page, so aim again once everything has settled,
    // unless the visitor has already started scrolling themselves.
    let touched = false;
    const touch = () => {
      touched = true;
    };
    window.addEventListener("wheel", touch, { passive: true, once: true });
    window.addEventListener("touchmove", touch, { passive: true, once: true });
    window.addEventListener("keydown", touch, { once: true });
    const settle = async () => {
      await document.fonts?.ready;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target || touched) return;
      requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior }));
    };
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });

    const introWatch = new MutationObserver(() => requestAnimationFrame(refresh));
    introWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });

    const main = document.querySelector("main");
    let last = main?.clientHeight ?? 0;
    let timer = 0;
    const heightWatch = new ResizeObserver(() => {
      if (!main || Math.abs(main.clientHeight - last) < 40) return;
      last = main.clientHeight;
      clearTimeout(timer);
      timer = window.setTimeout(refresh, 120);
    });
    if (main) heightWatch.observe(main);

    return () => {
      introWatch.disconnect();
      heightWatch.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", settle);
      window.removeEventListener("wheel", touch);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("keydown", touch);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-sign"
    />
  );
}
