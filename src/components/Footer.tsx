"use client";

import { RotateCcw } from "lucide-react";
import { useExperience } from "./Experience";
import { Logo } from "./Logo";
import { links, nav, site } from "@/data/site";

export function Footer() {
  const { canReplay, replay } = useExperience();

  return (
    <footer className="bg-ink text-milk">
      <div className="stitch-band opacity-40" aria-hidden />
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo className="w-44 md:w-56" />
          <p className="mt-6 max-w-[20rem] text-milk/60">
            {site.category} in {site.address}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-milk/75 transition-colors hover:text-milk">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 md:col-span-3">
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
            <p className="pt-3">
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
      <div className="shell border-t border-milk/10 py-6 text-sm text-milk/45">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
