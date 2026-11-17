import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/outfit";
import "./globals.css";
import { site, links } from "@/data/site";
import { INTRO_SESSION_KEY } from "@/lib/intro";

const title = `${site.name} | Coffee shop in Hlaliyeh, Saida`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: `${site.description} Sandos, salads and coffee in ${site.address}.`,
  keywords: ["Milk Concept Store", "coffee shop Saida", "Hlaliyeh cafe", "coffee Lebanon", "sandos", "salads"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_LB",
    images: [{ url: "/photos/storefront-sign.webp", width: 893, height: 505, alt: "The Milk sign at night" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#121110",
  width: "device-width",
  initialScale: 1,
};

// Decides before first paint whether the 3D intro will play, so nothing flashes.
const introBootScript = `(function(){var d=document.documentElement;try{var seen=sessionStorage.getItem(${JSON.stringify(
  INTRO_SESSION_KEY,
)});var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var deep=location.hash&&location.hash!=='#top';d.dataset.intro=(seen||still||deep)?'done':'play';}catch(e){d.dataset.intro='done';}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: site.name,
  url: site.url,
  telephone: `+${site.phoneDigits}`,
  servesCuisine: ["Coffee", "Sandwiches", "Salads"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hlaliyeh, Saida",
    addressCountry: "LB",
  },
  sameAs: [links.whatsapp],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
