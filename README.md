# Milk Concept Store website

A single-page site for Milk Concept Store (Hlaliyeh, Saida) with a 3D opening
sequence: a coffee bean cracks, coffee pours out and forms a cup printed with
the Milk wordmark, and the cup settles into the homepage.

Built with Next.js, TypeScript, Tailwind CSS, Three.js (React Three Fiber and
Drei), GSAP and Framer Motion.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000, reloads as you edit
npm run build    # writes the finished site to the "out" folder
npm start        # previews the built site
```

The `out` folder is plain static files. Upload it to any host (Netlify,
Vercel, Cloudflare Pages, or ordinary web hosting).

## Change the content

All text that changes lives in `src/data`. No design code needs touching.

| To change | Edit |
| --- | --- |
| Phone, address, opening hours, Google rating and links | `src/data/site.ts` |
| Sandos and salads (names, descriptions, prices) | `src/data/menu.ts` |
| Coffee and drinks | `src/data/drinks.ts` |
| Photos | `src/data/gallery.ts` and the files in `public/photos` |

## Before going live

- **Drinks.** The Coffee tab lists proposed drinks with no prices and a
  short note saying the list is being finalised. In `src/data/drinks.ts`,
  keep only what Milk serves, add prices, then set `drinksConfirmed` to
  `true` and the note disappears.
- **Product photos.** Drinks are shown as small drawings of the Milk cup and
  dishes as text cards, because no product photos were supplied. To use real
  photos, put them in `public/photos/menu` and add `image: "/photos/menu/…"`
  to an item in `src/data/menu.ts` or `src/data/drinks.ts`. Every card crops
  its photo to the same 4:3 frame.
- **Opening hours.** Only Monday (7 am to 11 pm) is filled in. Complete the
  week in `src/data/site.ts`.
- **Google link.** `rating.listingUrl` in `src/data/site.ts` opens a Google
  Maps search for the shop. Replace it with the exact Google Business link.
- **Website address.** Set `site.url` in `src/data/site.ts` to the real domain.
- **Logo.** `public/brand/logo.svg` and the two PNGs were traced from the
  photo of the shop sign. Replace them with the official artwork (same file
  names) when available; the site and the 3D cup pick it up automatically.
- **Photos.** The photos are crops of the pictures supplied, which are small.
  Larger originals will look sharper.

## Where things are

```
src/app                 page shell, fonts, colours (globals.css), SEO
src/components          one file per section: Navbar, Hero, PaperBand, About,
                        Menu (tabs; DrinksMenu and FoodMenu are its panels),
                        Gallery, Reviews, Contact, Footer; Reveal.tsx holds
                        the scroll animations
src/components/intro    the 3D film: IntroCanvas.tsx (scene and timeline),
                        geometry.ts (bean, cup, pour shapes)
src/components/Experience.tsx   decides whether the intro plays, handles
                        skip, replay, loading and the no-WebGL fallback
src/data                menu, drinks, photos, business details
```

The intro plays once per browser session, can be skipped, and can be replayed
from the footer. It is replaced by a still version when the visitor prefers
reduced motion, and by a flat version when WebGL is unavailable.
