import { useId } from "react";
import type { Tone } from "@/data/drinks";

const tones: Record<Tone, string> = {
  espresso: "#2a160b",
  americano: "#3f2414",
  latte: "#c8a27a",
  cappuccino: "#dcc19c",
  mocha: "#6a3f28",
  caramel: "#c98b48",
  vanilla: "#dcc39a",
  coldbrew: "#27140b",
  chocolate: "#513020",
  matcha: "#a9bf72",
  tea: "#c58a45",
  juice: "#f0a23c",
  cream: "#f1e6d2",
};

/**
 * A small drawing of a Milk cup, tinted with the drink inside it: the white
 * cup for hot drinks, the clear cup with ice for cold ones. It stands in for
 * a product photo until real ones are added to the drinks list.
 */
export function DrinkGlyph({ tone, iced = false, className = "" }: { tone: Tone; iced?: boolean; className?: string }) {
  const id = useId();
  const color = tones[tone];

  return (
    <svg viewBox="16 8 88 130" className={className} aria-hidden focusable="false">
      <ellipse cx="60" cy="131" rx="27" ry="4.5" fill="#121110" opacity="0.1" />
      {iced ? (
        <>
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6efe2" />
              <stop offset="0.42" stopColor={color} stopOpacity="0.75" />
              <stop offset="1" stopColor={color} />
            </linearGradient>
            <clipPath id={`${id}-cup`}>
              <path d="M29 36 L91 36 L83 121 Q82.5 128 76 128 L44 128 Q37.5 128 37 121 Z" />
            </clipPath>
          </defs>
          <path d="M26 36 Q60 12 94 36 Z" fill="#ffffff" opacity="0.7" stroke="#121110" strokeOpacity="0.18" strokeWidth="1.5" />
          <g clipPath={`url(#${id}-cup)`}>
            <rect x="26" y="44" width="68" height="86" fill={`url(#${id}-fill)`} />
            <rect x="40" y="48" width="17" height="17" rx="4" fill="#fff" opacity="0.55" transform="rotate(-14 48 56)" />
            <rect x="62" y="52" width="16" height="16" rx="4" fill="#fff" opacity="0.45" transform="rotate(18 70 60)" />
            <rect x="50" y="66" width="14" height="14" rx="4" fill="#fff" opacity="0.3" transform="rotate(8 57 73)" />
          </g>
          <path
            d="M29 36 L91 36 L83 121 Q82.5 128 76 128 L44 128 Q37.5 128 37 121 Z"
            fill="#ffffff"
            fillOpacity="0.16"
            stroke="#121110"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
          <rect x="24.5" y="33" width="71" height="6" rx="3" fill="#fff" stroke="#121110" strokeOpacity="0.18" strokeWidth="1.5" />
          <image href="/brand/logo-black.png" x="41" y="92" width="38" height="11.3" />
        </>
      ) : (
        <>
          <path
            d="M30 42 L90 42 L82 121 Q81.5 128 75 128 L45 128 Q38.5 128 38 121 Z"
            fill="#fbf8f0"
            stroke="#121110"
            strokeOpacity="0.14"
            strokeWidth="1.5"
          />
          <ellipse cx="60" cy="42" rx="30.5" ry="8" fill="#fbf8f0" stroke="#121110" strokeOpacity="0.16" strokeWidth="1.5" />
          <ellipse cx="60" cy="43" rx="25.5" ry="5.6" fill={color} />
          <ellipse cx="52" cy="42" rx="9" ry="1.8" fill="#fff" opacity="0.28" />
          <image href="/brand/logo-black.png" x="41" y="76" width="38" height="11.3" />
        </>
      )}
    </svg>
  );
}
