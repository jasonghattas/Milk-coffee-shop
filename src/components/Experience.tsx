"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { INTRO_SESSION_KEY, hasWebGL, prefersReducedMotion } from "@/lib/intro";

/**
 * Runs the opening sequence.
 *
 *  pending  : before the browser has been inspected (server render)
 *  intro    : the 3D film plays, then hands over to the page
 *  static   : the cup is shown in its final place, no film (already seen
 *             this session, reduced motion, or the visitor skipped early)
 *  fallback : no WebGL; a flat version of the hero visual is shown instead
 */
export type Mode = "pending" | "intro" | "static" | "fallback";

type Experience = {
  mode: Mode;
  /** Changes every time the intro is replayed, to remount the scene. */
  runId: number;
  /** 0 to 100, shown on the loading screen. */
  progress: number;
  loaderOut: boolean;
  /** True once the loading screen is gone and the film may start. */
  started: boolean;
  /** True once the page content has been let in. */
  revealed: boolean;
  skipSignal: number;
  canReplay: boolean;
  reportProgress: (value: number) => void;
  sceneReady: () => void;
  reveal: () => void;
  skip: () => void;
  replay: () => void;
  fail: () => void;
};

const Ctx = createContext<Experience | null>(null);

export function useExperience(): Experience {
  const value = useContext(Ctx);
  if (!value) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return value;
}

/** Never keep a visitor waiting on the loader longer than this. */
const MAX_WAIT_MS = 9000;

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [runId, setRunId] = useState(0);
  const [progress, setProgress] = useState(8);
  const [loaderOut, setLoaderOut] = useState(false);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [skipSignal, setSkipSignal] = useState(0);
  const [canReplay, setCanReplay] = useState(false);
  const readyRef = useRef(false);

  const reveal = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* private mode: the intro simply plays again next time */
    }
    setRevealed(true);
  }, []);

  // Decide what this visitor gets.
  useEffect(() => {
    const wantsIntro = document.documentElement.dataset.intro === "play";
    if (!hasWebGL()) {
      setMode("fallback");
      reveal();
      return;
    }
    setCanReplay(!prefersReducedMotion());
    if (wantsIntro) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setMode("intro");
    } else {
      setMode("static");
      setRevealed(true);
    }
  }, [reveal]);

  const sceneReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setProgress(100);
    // Let "100" register for a beat, then lift the curtain and roll the film.
    window.setTimeout(() => {
      setLoaderOut(true);
      setStarted(true);
    }, 180);
  }, []);

  const toStatic = useCallback(() => {
    setMode((m) => (m === "intro" ? "static" : m));
    setLoaderOut(true);
    reveal();
  }, [reveal]);

  // Failsafe: slow connection or a stalled download never blocks the page.
  useEffect(() => {
    if (mode !== "intro" || started) return;
    const id = window.setTimeout(() => {
      if (!readyRef.current) toStatic();
    }, MAX_WAIT_MS);
    return () => window.clearTimeout(id);
  }, [mode, started, runId, toStatic]);

  const skip = useCallback(() => {
    if (!started) {
      toStatic();
      return;
    }
    // Let the page in immediately; the cup glides to its place behind it.
    reveal();
    setSkipSignal((n) => n + 1);
  }, [started, toStatic, reveal]);

  const replay = useCallback(() => {
    if (!canReplay) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.dataset.intro = "play";
    readyRef.current = false;
    setProgress(60);
    setLoaderOut(false);
    setStarted(false);
    setRevealed(false);
    setSkipSignal(0);
    setMode("intro");
    setRunId((n) => n + 1);
  }, [canReplay]);

  const fail = useCallback(() => {
    setMode("fallback");
    setLoaderOut(true);
    reveal();
  }, [reveal]);

  const reportProgress = useCallback((value: number) => {
    setProgress((p) => (readyRef.current ? p : Math.max(p, Math.min(96, Math.round(value)))));
  }, []);

  const value = useMemo<Experience>(
    () => ({
      mode, runId, progress, loaderOut, started, revealed, skipSignal, canReplay,
      reportProgress, sceneReady, reveal, skip, replay, fail,
    }),
    [mode, runId, progress, loaderOut, started, revealed, skipSignal, canReplay, reportProgress, sceneReady, reveal, skip, replay, fail],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
