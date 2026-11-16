"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("#top");

  // Mark the link of the section that currently holds the middle of the screen.
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile menu, and close it with Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="intro-hide fixed inset-x-0 top-0 z-50 text-milk">
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || open ? "bg-ink/88 shadow-[0_1px_0_rgba(244,241,232,0.08)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
      <nav
        aria-label="Main"
        className={`shell flex items-center justify-between transition-[height] duration-500 ${scrolled ? "h-16" : "h-20"}`}
      >
        <a href="#top" aria-label="Milk Concept Store, back to top" onClick={() => setOpen(false)}>
          <Logo className={`transition-[width] duration-500 ${scrolled ? "w-[84px]" : "w-[104px]"}`} />
        </a>

        <ul className="hidden items-center gap-9 text-[0.95rem] lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={current === item.href ? "true" : undefined}
                className={`relative py-2 transition-colors duration-300 hover:text-milk ${
                  current === item.href ? "text-milk" : "text-milk/65"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-sign transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                    current === item.href ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#menu" className="btn btn-sign hidden min-h-[42px] px-5 text-[0.95rem] sm:inline-flex">
            Explore our menu
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} aria-hidden /> : <MenuIcon size={24} aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <ul className="shell flex flex-col pb-8 pt-2">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-milk/10">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-display text-3xl lowercase"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-6 sm:hidden">
                <a href="#menu" onClick={() => setOpen(false)} className="btn btn-sign w-full">
                  Explore our menu
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
