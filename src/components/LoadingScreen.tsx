"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "./Experience";

/** Curtain shown while the 3D scene downloads, plus the "Skip intro" control. */
export function LoadingScreen() {
  const { mode, progress, loaderOut, revealed, skip } = useExperience();
  const [shown, setShown] = useState(0);
  const target = useRef(progress);
  target.current = progress;

  // Count smoothly towards the real figure instead of jumping.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setShown((value) => {
        const next = value + (target.current - value) * 0.12;
        return target.current - next < 0.4 ? target.current : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Escape skips the intro, like the button.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.documentElement.dataset.intro === "play") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const percent = Math.round(shown);
  const showSkip = (mode === "intro" || mode === "pending") && !revealed;

  return (
    <>
      <div
        className={`intro-loader fixed inset-0 z-[60] flex-col items-center justify-center gap-7 bg-ink text-milk ${loaderOut ? "is-out" : ""}`}
        role="status"
        aria-live="polite"
        aria-hidden={loaderOut}
      >
        <div className="relative w-44 md:w-56" role="img" aria-label="Milk">
          <span className="wordmark w-full text-milk/15" />
          <span
            className="wordmark absolute inset-0 w-full text-sign"
            style={{ clipPath: `inset(${100 - percent}% 0 0 0)`, transition: "clip-path 0.25s linear" }}
          />
        </div>
        <p className="text-xs tabular-nums tracking-wide text-milk/45">
          <span className="sr-only">Loading </span>
          {percent}%
        </p>
      </div>

      {showSkip && (
        <button
          type="button"
          onClick={skip}
          className="btn btn-ghost intro-skip fixed bottom-6 right-6 z-[65] min-h-[44px] bg-ink/40 px-5 text-sm text-milk backdrop-blur"
        >
          Skip intro
        </button>
      )}
    </>
  );
}
