/**
 * Business details. Edit this file to change anything about the shop
 * (phone, address, hours, rating); the page updates everywhere it is used.
 */

export const site = {
  name: "Milk Concept Store",
  shortName: "Milk",
  category: "Coffee shop",
  address: "Hlaliyeh, Saida, Lebanon",
  /** Shown to visitors. */
  phoneDisplay: "+961 81 410 800",
  /** Digits only, with country code: used for the phone and WhatsApp links. */
  phoneDigits: "96181410800",
  whatsappMessage: "Hello Milk! ",
  /** Set this to the public site address before going live (used for SEO tags). */
  url: "https://milkconceptstore.com",
  headline: "Your daily ritual, elevated.",
  description:
    "Discover exceptional coffee, delicious treats, and a cozy atmosphere at Milk Concept Store.",
} as const;

/**
 * Google rating, as supplied by the owner.
 * Replace `listingUrl` with the exact Google Business link once you have it;
 * until then it opens a Google Maps search for the shop.
 */
export const rating = {
  score: 4.9,
  outOf: 5,
  count: 30,
  listingUrl:
    "https://www.google.com/maps/search/?api=1&query=Milk+Concept+Store+Hlaliyeh+Saida+Lebanon",
};

export const map = {
  embedUrl:
    "https://www.google.com/maps?q=Milk+Concept+Store+Hlaliyeh+Saida+Lebanon&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Milk+Concept+Store+Hlaliyeh+Saida+Lebanon",
};

/**
 * Opening hours. Use 24h "HH:MM" strings, or null for a time that is not
 * confirmed yet (the page then shows "to be confirmed" for that day).
 * Only Monday's opening time and the 11 pm closing time were supplied,
 * so the other days are left for the owner to fill in.
 */
export type DayHours = { day: string; open: string | null; close: string | null; closed?: boolean };

export const hours: DayHours[] = [
  { day: "Monday", open: "07:00", close: "23:00" },
  { day: "Tuesday", open: null, close: null },
  { day: "Wednesday", open: null, close: null },
  { day: "Thursday", open: null, close: null },
  { day: "Friday", open: null, close: null },
  { day: "Saturday", open: null, close: null },
  { day: "Sunday", open: null, close: null },
];

export const links = {
  phone: `tel:+${site.phoneDigits}`,
  whatsapp: `https://wa.me/${site.phoneDigits}?text=${encodeURIComponent(site.whatsappMessage)}`,
};

export const nav = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;
